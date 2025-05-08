import path from 'path';
import fs from 'fs';
import { globSync } from 'glob';
import matter from 'gray-matter';
import { countWords } from '@homegrown/word-counter';
import { marked } from 'marked';
import { imageSize } from 'image-size';
import { LRUCache } from 'lru-cache';
import twemoji from 'twemoji';
import { endPerf, startPref } from './performance';

const cache = new LRUCache({ max: 1000 });

const contentPath = path.resolve(process.cwd(), './contents');
const publicPath = path.resolve(process.cwd(), './public');

export interface PostMeta {
  path: string;
  params: {
    year: string;
    post: string;
  };
  title: string;
  description?: string;
  cover?: string;
  date: Date;
  pubdate?: Date;
  words: number;
  content: string;
  preview?: string;
  keywords?: string[];
}

export interface PostList {
  list: PostMeta[];
  pageSize: number;
  totalPages: number;
  wordsCount: number;
}

export interface PostContent extends PostMeta {
  html: string;
  toc?: string;
}

const renderMarkdown = async (content: string, imgPrefix: string) => {
  const headings: Array<{ id: string; level: number; text: string }> = [];
  marked.use({
    renderer: {
      heading({ tokens, depth }) {
        const text = this.parser.parseInline(tokens);
        const escapedText = text.toLowerCase().replace(/[\s]+/gi, '-');
        headings.push({ id: escapedText, level: depth, text });
        return `<h${depth} id="${escapedText}">${text}</h${depth}>`;
      },
      link({ text, href }) {
        return `<a href="${href}" target="_blank" rel="noreferrer">${text}</a>`;
      },
      image({ text, href }) {
        const imagePath = path.join(publicPath, imgPrefix, href);
        if (!fs.existsSync(imagePath)) {
          return '';
        }
        const buffer = fs.readFileSync(imagePath);
        const { width, height } = imageSize(buffer);
        const ratio = ((height / width) * 100).toFixed(2);
        const fullHref = `${imgPrefix}/${href}`;
        return `
        <div class="fiximg" style="width:100%" data-alt="${text}">
          <div class="fiximg__container" style="padding-bottom:${ratio}%">
            <img loading="lazy" src="${fullHref}" alt="${text}" data-zoomable class="medium-zoom-image" />
          </div>
        </div>
      `.replace(/\s*\n\s*/gi, '\n');
      },
    },
  });
  let html = await marked.parse(content);
  let toc = '';
  if (headings.length > 0) {
    toc = `
      <ul class="toc">
        ${headings
          .map((heading) => {
            return `
              <li class="toc__item toc__item--${heading.level}">
                <a href="#${heading.id}">${heading.text}</a>
              </li>
            `;
          })
          .join('\n')}
      </ul>
    `.replace(/\s*\n\s*/gi, '\n');
  }
  // twemoji
  const twemojiOptions = {
    base: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/',
    folder: 'svg',
    ext: '.svg',
  };
  html = twemoji.parse(html, twemojiOptions);
  toc = twemoji.parse(toc, twemojiOptions);
  return { html, toc };
};

/**
 * @param postPath /[list]/[year]/[post]
 */
const getPostMeta = async (postPath: string) => {
  const cacheKey = `getPostMeta:${postPath}`;
  if (cache.has(cacheKey) && process.env.NODE_ENV === 'production') {
    console.log(`[lru-cache] <hit> ${cacheKey}`);
    return cache.get(cacheKey) as PostMeta;
  }

  // startPref('getPostMeta');
  const globFile = globSync(`${contentPath}/${postPath}.md`);
  const filePath = globFile[0] || '';
  if (!filePath || !fs.existsSync(filePath)) {
    throw new Error(`Post ${postPath} not found`);
  }
  const fileContents = fs.readFileSync(filePath, 'utf-8');
  const { content, data } = matter(fileContents);
  // params
  const exp = /\/([^/]+)\/([^/]+)\/([^/]+)/i.exec(postPath);
  const params = { year: '', post: '' };
  if (exp) {
    params.year = exp[2];
    params.post = exp[3];
  }
  // 封面
  let cover = '';
  const coverPath = path.join(publicPath, postPath, 'index.webp');
  if (fs.existsSync(coverPath)) {
    cover = `${postPath}/index.webp`;
  }
  // 字数
  const words = countWords(content);
  // 预览
  let preview = '';
  const previewContent = (content.split('<!--more-->') || [])[0];
  if (previewContent) {
    const { html } = await renderMarkdown(previewContent, postPath);
    preview = html;
  }

  // endPerf('getPostMeta');
  const res = {
    path: postPath,
    params,
    ...data,
    cover,
    words,
    content,
    preview,
  };
  cache.set(cacheKey, res);
  return res as PostMeta;
};

export const getPostList = async () => {
  const cacheKey = 'getPostList';
  if (cache.has(cacheKey) && process.env.NODE_ENV === 'production') {
    console.log(`[lru-cache] <hit> ${cacheKey}`);
    return cache.get(cacheKey) as PostList;
  }

  startPref('getPostList');
  const postList: PostList = {
    list: [],
    pageSize: 10,
    totalPages: 0,
    wordsCount: 0,
  };
  const allMarkdownFiles = globSync(`${contentPath}/post/**/*.md`);
  const allMarkdownFilesWithoutIndex = allMarkdownFiles.filter((file) => {
    return !file.includes('index.md');
  });
  // 并发读取
  const promises: Array<Promise<void>> = [];
  const readPost = async (markdownFile: string) => {
    const fullFilePath = path.resolve(process.cwd(), markdownFile);
    const relFilePath = path.relative(contentPath, fullFilePath);
    const postPath = relFilePath.replace('.md', '').replace(/\\/gi, '/');
    const postMeta = await getPostMeta(`/${postPath}`);
    postList.list.push(postMeta);
    postList.wordsCount += postMeta.words;
    postList.totalPages = Math.ceil(postList.list.length / postList.pageSize);
  };
  for (let i = 0; i < allMarkdownFilesWithoutIndex.length; i++) {
    const markdownFile = allMarkdownFilesWithoutIndex[i];
    promises.push(readPost(markdownFile));
  }
  await Promise.all(promises);
  postList.list.sort((a, b) => {
    return b.date.getTime() - a.date.getTime();
  });

  endPerf('getPostList');
  cache.set(cacheKey, postList);
  return postList;
};

/**
 * @param postPath /[list]/[year]/[post]
 */
export const getPostContent = async (postPath: string) => {
  const cacheKey = `getPostContent:${postPath}`;
  if (cache.has(cacheKey) && process.env.NODE_ENV === 'production') {
    console.log(`[lru-cache] <hit> ${cacheKey}`);
    return cache.get(cacheKey) as PostContent;
  }

  startPref('getPostContent');
  const { content, ...meta } = await getPostMeta(postPath);
  const { html, toc } = await renderMarkdown(content, postPath);

  endPerf('getPostContent');
  const res = { ...meta, content, html, toc };
  cache.set(cacheKey, res);
  return res as PostContent;
};
