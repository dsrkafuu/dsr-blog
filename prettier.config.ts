import { type Options } from 'prettier';

const options: Options = {
  singleQuote: true,
  plugins: [
    '@trivago/prettier-plugin-sort-imports',
  ],
};

export default options;
