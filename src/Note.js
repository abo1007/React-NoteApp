import React,{Component} from 'react';
import ReactDOM from 'react-dom';

// import './App.scss';
import "normalize.css";
import './Note.scss';
import folder from './assets/folder.png';
import item from './assets/item.png';
import laji from './assets/laji.png';
import bailaji from './assets/bailaji.png';

import axios from 'axios';

class Note extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            notebooks:[],

        }
    }

    componentDidMount(){
        this.getNoteData();
    }
    
    render(){
        let notebooks = this.state.notebooks;
        return (
    <div className="App">
      <div className="left">
        <div className="biglist">
          <div className="top">
            <div className="addbtn">+</div>
            <span>新建笔记</span>
          </div>
          <div className="filelist">
            <div className="folder">
              <p className="title">
                <img src={folder}></img>
                <span>笔记本</span>
              </p>
              {
                  notebooks.map((notebook, index) => (
                    <p className="item" key={notebook.id}>
                        <img src={item} />
                        <span>{notebook.name}</span>
                        <img src={bailaji} className="right-img"/>
                    </p>
                  ))
              } 
            </div>
          </div>
        </div>

        <div className="list">
          <p className="filetitle">文件夹标题</p>
          <div className="itemlist">
            <div className="page">
              <div className="borad">
                <p className="ti">新建笔记</p>
                <p className="con">笔记摘要内容</p>
              </div>
              <p className="date">
                <span>2021-03-27</span>
                <img src={laji} alt="删除"/>
              </p>
            </div>
          </div>
        </div>

      </div>
      <div className="right">
        <div className="top">
          <div className="bigtitle">
            <p>印象笔记 for React</p>
          </div>
          <div className="title">
            <input type="text" defaultValue="标题"/>
          </div>
        </div>
        <div className="bot">
          <div className="ed">
            <textarea id="text"></textarea>
          </div>
          <div className="md">
            
          </div>
        </div>
      </div>
    </div>
        )
    }
    getNoteData(){
        axios.get('http://localhost:3100/notebooks').then(res => {
            this.setState({
                notebooks:res.data
            })
        }).catch(err => {
            console.log(err);
        })
    }
}

export default Note;