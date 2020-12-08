---
title: 'React.js'
date: 2020-07-19T09:26:55+08:00
tags:
  - 'react'
  - 'javascript'
description: '学习 React 之随笔记录。'
image: '/images/2020/react-js-live-note/header.webp'
---

这篇文章用于记录自己在学习 React 时不够熟练的部分以及与其他框架有不同之处的部分，用于自己将来的复习及日常开发。笔记将会随着自己的学习进度随时更新。

<!--more-->

- [Vue 3 即时笔记](/code/vue-js-3-live-note/)
- [Vue 2 即时笔记](/code/vue-js-live-note/)

## 基础内容

### 数据的流向与绑定

数据从 `state` 流向页面，通过监听页面变化更新数据，从而改变页面的显示。而 Vue 中 `v-model` 的 "双向" 绑定其本质也是类似这样的过程的语法糖。

```jsx
class TodoList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: '',
      todoList: [],
    };
    // 也可以在构造函数中统一绑定 this
    this.handleClick = this.handleClick.bind(this);
  }

  render() {
    return (
      <React.Fragment>
        <div>
          <input value={this.state.inputValue} onChange={this.handleListChange.bind(this)} />
          <button onClick={this.handleClick}>提交</button>
        </div>
        <ul>
          {this.state.todoList.map((val, index) => {
            return <li key={`list-${index}`}>{val}</li>;
          })}
        </ul>
      </React.Fragment>
    );
  }

  handleListChange(e) {
    this.setState({
      inputValue: e.target.value,
    });
  }

  handleClick() {
    let val = this.state.inputValue;
    if (val && !this.state.todoList.includes(val)) {
      this.setState({
        todoList: [...this.state.todoList, this.state.inputValue],
        inputValue: '',
      });
    }
  }
}
```

### 父子组件传值

父组件通过属性传递给子组件，子组件获取。与 Vue 中基础的 emit 事件不同，这里可以直接将父组件的函数传递给子组件来调用。

```jsx
// 父组件中
{
  this.state.todoList.map((val, index) => {
    return (
      // 传递函数给子组件时也要注意 this 指向
      <TodoItem
        content={val}
        index={index}
        deleteItem={this.handleDelete.bind(this)}
        key={`list-${index}`}
      />
    );
  });
}
// 也可以在构造函数中统一绑定 this
this.handleDelete = this.handleDelete.bind(this);
// 子组件
class TodoItem extends React.Component {
  render() {
    const { content, index, deleteItem } = this.props;
    return (
      <li>
        {content}
        <button
          onClick={() => {
            // 箭头函数，无需绑定 this 已指向上层 this (组件本身)
            deleteItem(index);
          }}
        >
          删除
        </button>
      </li>
    );
  }
}
```

### 异步 setState

```js
// 同步
handleListChange(e) {
  this.setState({
    inputValue: e.target.value,
  });
}
handleClick() {
    let val = this.state.inputValue;
    if (val) {
      this.setState({
        todoList: [...this.state.todoList, this.state.inputValue],
        inputValue: '',
      });
    }
  }
// 异步
handleListChange(e) {
  const value = e.target.value; //先保存数据
  this.setState(() => {
    return {
      inputValue: value,
    };
  });
}
handleClick() {
  if (this.state.inputValue) {
    this.setState((prevState) => {
      return {
        todoList: [...prevState.todoList, prevState.inputValue],
        inputValue: '',
      };
    });
  }
}
```

### 属性类型简单校验

```js
class TodoItem extends React.Component {
  static propTypes = {
    content: PropTypes.string,
    index: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired, // 必须
    deleteItem: PropTypes.func.isRequired, // 必须
  };
  static defaultProps = {
    content: 'A ListItem', // 默认值
  };
}
```

### 生命周期函数

父组件 `input` 更新，`render()` 调用，其中的子组件也自动调用 `render()` 渲染，使用 `shouldComponentUpdate` 可以判断数据是否变化明确指定组件是否要重渲染。

```js
// 防止单个子组件重复渲染
shouldComponentUpdate(nextProps) {
  return nextProps.content !== this.props.content;
}
```

## 组件分类与拆分

### 普通组件

当单个组件内包含了所有数据逻辑以及页面渲染的内容时，后期和维护可能会变得不便，因此可以将组件进行拆分。拆分后的 UI 组件负责页面渲染，而容器组件负责逻辑的处理。

### UI 组件

UI 组件中包括 `render` 函数、其他有关渲染的函数以及其他 UI 框架类内容的引入。数据一般通过属性传入该组件并进行显示，且其本身只负责显示，不包括任何逻辑。

```jsx
import React from 'react';
import 'antd/dist/antd.css';
import { Input, Button, List } from 'antd';

class AntTodoUI extends React.Component {
  render() {
    return (
      <div style={{ margin: '10px', width: '300px' }}>
        <div style={{ display: 'flex', marginBottom: '10px' }}>
          <Input
            value={this.props.inputValue}
            onChange={this.props.handleInputChange}
            placeholder="Enter todo info"
          ></Input>
          <Button type="primary" onClick={this.props.handleBtnClick} style={{ marginLeft: '10px' }}>
            Add
          </Button>
        </div>
        <div>
          <List
            size="small"
            bordered
            dataSource={this.props.todoList}
            renderItem={(item) => <List.Item>{item}</List.Item>}
          />
        </div>
      </div>
    );
  }

  shouldComponentUpdate() {
    ...
  }
}

export default AntTodoUI;
```

### 容器组件

容器组件中使用 UI 组件并传入属性来显示页面，其中包括了大部分的业务逻辑内容。

```jsx
import React from 'react';
import store from './store/index';
import { getAddTodoItemAct, getInputChangeAct } from './store/actCreators';
import AntTodoUI from './AntTodoUI';

class AntTodo extends React.Component {
  // init state from store
  state = store.getState();

  constructor(props) {
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleStoreChange = this.handleStoreChange.bind(this);
    this.handleBtnClick = this.handleBtnClick.bind(this);
    // watch changes in store
    store.subscribe(this.handleStoreChange);
  }

  render() {
    return (
      <AntTodoUI
        inputValue={this.state.inputValue}
        handleInputChange={this.handleInputChange}
        handleBtnClick={this.handleBtnClick}
        todoList={this.state.todoList}
      />
    );
  }

  handleInputChange(e) {
    // dispatch a action
    const action = getInputChangeAct(e.target.value);
    store.dispatch(action);
  }

  handleBtnClick() {
    const action = getAddTodoItemAct();
    store.dispatch(action);
  }

  handleStoreChange() {
    this.setState(() => store.getState());
  }
}

export default AntTodo;
```

### 无状态组件

类似上文的 UI 组件示例这样的组件，其中只有一个 render 函数通过属性显示出内容，这样的组件可以定义为无状态组件 \(一个函数\)。无状态组件性能优于普通组件，但是普通组件可以很方便的使用生命周期函数。

```jsx
import React from 'react';
import 'antd/dist/antd.css';
import { Input, Button, List } from 'antd';

const AntTodoUI = (props) => {
  return (
    <div style={{ margin: '10px', width: '300px' }}>
      <div style={{ display: 'flex', marginBottom: '10px' }}>
        <Input
          value={props.inputValue}
          onChange={props.handleInputChange}
          placeholder="Enter todo info"
        ></Input>
        <Button type="primary" onClick={props.handleBtnClick} style={{ marginLeft: '10px' }}>
          Add
        </Button>
      </div>
      <div>
        <List
          size="small"
          bordered
          dataSource={props.todoList}
          renderItem={(item) => <List.Item>{item}</List.Item>}
        />
      </div>
    </div>
  );
};

export default AntTodoUI;
```

## Redux 与 Vuex 的对比

### Redux 中的基本数据流向

1. 传入 reducer 初始化 store，设定初始 `state(store)`
2. 组件使用 `state = store.getState()` 初始化自身的 `state(component)`
3. 组件使用自身的 `state(component)` 显示数据
4. 组件数据改变时，dispatch 一个 action，传入 `type` 和 `value(optional)`
5. store 接收到 action 转发给 reducer 进行处理
6. reducer 判断 `type` 并返回新 `state(store)`给 store
7. 组件中 `store.subscribe(cb)` 的回调函数触发，再次通过 `store.getState()` 更新自身的 `state(component)`
8. 当使用 `react-redux` 时则无需手动订阅，使用 `mapStateToProps` 和 `mapDispatchToProps` 通过 `Provider` 和 `connect()` 进行数据链接即可

### Vuex 中的基本数据流向

1. 初始化 store，其中可以包含 `store` `getter` `mutation` `action` 和 `module`
2. 组件使用计算属性获取 store 中的数据并显示，或通过 store 中数据初始化自己的 `data` 副本进行数据显示
3. 数据改变时，组件 commit 一个 mutation，传递数据**同步**改变 store 中数据
4. 数据改变时，组件也可 dispatch 一个 action，在 action 中可以进行**异步**操作或提交**同步** mutation 进行数据更新
5. 数据满足 Vue 的响应式原理，当能被监测到的数据改变发生时，组件中获取 store 的计算属性会自动更新

### 对比内容

- 数据是否 Immutable 为一个主要关注点：
  - Redux 中不对数据直接进行修改，而是通过 reducer 将新的数据类似 `Object.assign` 到旧数据上，并且需要组件进行订阅变化及重新获取数据
  - Vuex 中直接对 store 中的数据进行了修改，并且通过 Vue 的响应式原理监听数据更新，动态反映到使用数据的组件上
- Redux 中的 store 初始化依赖于 reducer 的默认返回值；Vuex 中的 store 直接进行初始化即可
- Redux 统一单个 dispatch 方法，其中可以进行同步和异步 \(通过 redux-thunk 中间件\) 的操作；Vuex 中异步操作直接通过 dispatch async action \(无需插件\)，同步操作也可以直接 commit mutation 来实现

### 快速 MAP 方法 \(库结合\)

#### Redux

- mapStateToProps
- mapDispatchToProps

#### Vue

- mapState
- mapGetters
- mapMutations
- mapActions

## React 路由

### 路由匹配

React Router 的路由匹配模式与 Vue 的静态路由有所不同：

```jsx
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

class App extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/detail">
            <Detail />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </Router>
    );
  }
}
```

在这种情况下，当访问某个 URL 时，路由由上至下一次匹配且只显示一个：

- `/detail` => detail 页面
- `/` => 主页

若将 detail 页面与主页的路由位置相反声明，则 `/detail` 由于已经匹配 `/`，会直接显示主页，而不会显示 detail 页面；此外，如果不使用 Switch 组件，则路由会返回匹配的所有页面，例如在上面的定义下去掉 Switch 组件，则访问 `/detail` 会同时显示两个页面，访问 `/` 则只显示主页 (按顺序显示，但定义顺序无关)。

```jsx
// 在以下两种未使用 Switch 的情况下访问 /detail
<Route path="/"><Home /></Route>
<Route path="/detail"><Detail /></Route>
// 同时显示 home 与 detail
<Route path="/detail"><Detail /></Route>
<Route path="/"><Home /></Route>
// 同时显示 detail 与 home
```

同时，也可以使用一种与 Vue 路由类似的模式，当给 Route 添加 `exact` 属性时候则必须要完全匹配。

### 参数传递

#### 动态路由

路由的 Link 中 `to` 属性直接传递 ID 给 URL：

```jsx
import { Link } from 'react-router-dom';
{
  list.map((val) => {
    return (
      <ListItem key={val.get('id')}>
        <Link to={`/detail/${val.get('id')}`}>
          {' '}
          // 直接传
          <h2>{val.get('title')}</h2>
        </Link>
        <p>{val.get('desc')}</p>
      </ListItem>
    );
  });
} // 这里使用了 immuable 所以需要 get 方法
```

在路由中使用变量：

```jsx
<Route path="/detail/:id" component={Detail} />
```

组件中获取变量：

```jsx
const id = this.props.match.params.id;
```

#### URL Params

```jsx
<Link className="router-link" to={`/detail?id=${val.get('id')}`}>
  <img src={val.get('img')} alt="LISTICON" />
</Link>
```

在路由中使用变量：

```jsx
<Route path="/detail" component={Detail} />
```

组件中获取变量：

```jsx
const param = new URLSearchParams(this.props.location.search);
const id = param.get('id');
```

## 第三方支持相关

### Immutable.js

Immutable.js 可以方便的用于 React 中确保 state 不被直接修改，其可用于生成不可直接改变的 immutable 对象。

#### 转换对象

```js
import { fromJS } from 'immutable';

const defaultState = fromJS({
  searchInput: '',
});
```

#### 获取数据

```js
const mapStateToProps = (state) => {
  return {
    searchInput: state.header.get('searchInput'),
    // 这里的 header 是由于使用了 combineReducers()
  };
};
```

#### 更新数据 (新对象替换)

```js
export default (prevState = defaultState, action) => {
  switch (action.type) {
    case UPDATE_SEARCH_INPUT: {
      return prevState.set('searchInput', action.value);
    }
    default: {
      return prevState;
    }
  }
};
```

#### redux-immutable

将根 store 的 state 也变为 immutable 对象：

```js
// store/index.js
import { combineReducers } from 'redux-immutable';
import { reducer as header } from '../components/Header/store';
export default combineReducers({
  header,
});
// src/components/Header/index.js
const mapStateToProps = (state) => {
  return {
    searchInput: state.get('header').get('searchInput'),
  };
};
// searchInput: state.getIn(['header', 'searchInput']),
```

#### 注意点

```js
import { fromJS } from 'immutable';
const defaultState = fromJS({
  list: [],
});
export default (prevState = defaultState, action) => {
  switch (action.type) {
    case UPDATE_LIST: {
      return prevState.set('list', action.list);
    }
    default: {
      return prevState;
    }
  }
};
```

在这种情况下，`fromJS` 方法会把 `list` 数组也变为 immutable 数组，因此下面的直接将 `list` 设置为普通 JS 数组的操作其实是有问题的。因此，应该在从接口等获取数据创建 action 时将数组转为 immutable 数组：

```js
const updateList = (list) => {
  return {
    type: UPDATE_LIST,
    list: fromJS(list), // 注意转换
  };
};
/**
 * 获取热门搜索数据
 */
export const getTopList = () => {
  return async (dispatch) => {
    try {
      let res = await axios.get('/toplist');
      dispatch(updateList(res.data));
    } catch (e) {
      console.error(e);
    }
  };
};
```

## 虚拟 DOM diff 算法相关

![比对示意图](/images/2020/react-js-live-note/diff01.webp)

从第一层开始比对，若第一层 VDOM 已经不同，则将顶层 VDOM 开始对应的 DOM 树进行重新渲染并替换；若相同，则向下递归层级比对，以不同的子树为跟进行 DOM 的重新渲染。

![合并示意图](/images/2020/react-js-live-note/diff02.webp)

短时间内多次 `setState` 可以异步合并至一个 tick，视为一次变化进行比对渲染。

![设置 key 值的作用示意图](/images/2020/react-js-live-note/diff03.webp)

`key` 值的作用，比对中可以根据该值方便识别出新增或删除的元素；这也是 `key` 值不建议使用 `index` 的原因，因为一旦顺序改变将无法保证内容的一致性。

父组件的 `render()` 重新渲染时，子组件也会 `render()` 重新渲染，通过组件的 `shouldComponentUpdate()` 生命周期函数来判断并决定究竟是否需要重新渲染。
