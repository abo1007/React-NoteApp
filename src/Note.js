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
import marked from 'marked';
import 'github-markdown-css';



class Note extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            notebooks:[],
            currentBookIndex:0,
            notes:[],
            currentNote:null,
            defaultTip:"## 空指针",
            defaultTitle:"新建笔记"
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
          <div className="top" onClick={() => this.handleAddNote()}>
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
                    <p className={this.state.currentBookIndex === index?'item item-active':"item"} 
                        key={notebook.id}
                        onClick={() => this.handleBookSelect(index)}>
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
            {
              this.state.notes.map((item, index) => (
                <div className="page" key={item.id}>
                  <div className="borad" onClick={() => this.handleEditNote(item.id)}>
                    <p className="ti">{item.title}</p>
                    <p className="con">{item.body}</p>
                  </div>
                  <p className="date">
                    <span>{item.datetime}</span>
                    <img src={laji} alt="删除"/>
                  </p>
                </div>
              ))
            }
          </div>
        </div>

      </div>
      <div className="right">
        <div className="top">
          <div className="bigtitle">
            <p>印象笔记 for React</p>
          </div>
          <div className="title">
            <input type="text" value={this.getTitle()} onChange={e => this.handleEditNote(e, 1)}/>
          </div>
        </div>
        <div className="bot">
          <div className="ed">
            <textarea id="text" 
                      value={this.state.currentNote?this.state.currentNote.body:this.state.defaultTip} 
                      onChange={e => this.handleFieldChange(e, 2)}></textarea>
          </div>
          <div className="md text markdown-body" 
                dangerouslySetInnerHTML={{__html:this.getHtml()}}></div>
        </div>
      </div>
    </div>
        )
    }

    getNoteData(){
      axios.get('http://localhost:3100/notebooks').then(res => {
        this.setState({notebooks:res.data});
        this.LoadNotes(this.state.notebooks[0].id);
      }).catch(err => {
         console.log(err);
      })
    }

    handleAddNote(){
      let book = this.state.notebooks[this.state.currentBookIndex];
      let note = {
        title:'新建笔记',
        body:'',
        datetime:new Date().toISOString(),
        notebookId:book.id
      }
      axios.post('http://localhost:3100/notes', note).then(res => {
        this.LoadNotes(book.id);
      }).catch(err => {
        console.log(err);
      })
    }

    handleBookSelect(index){
        this.setState({currentBookIndex:index});
        let book = this.state.notebooks[index];
        this.LoadNotes(book.id);
    }

    handleFieldChange(e, mode){
      if(mode == 1){
        if(this.state.currentNote == null){
          this.setState({defaultTitle:e.target.value})
        }else{
          this.setState({currentNote:{body:e.target.value}});
        }
      }else if(mode == 2){
        if(this.state.currentNote == null){
          this.setState({defaultTip:e.target.value})
        }else{
          this.setState({currentNote:{title:e.target.value}});
        }
      }
      
    }

    handleEditNote(id){
      axios.get('http://localhost:3100/notes/' + id).then(res => {
        this.setState({ currentNote : res.data });
        // console.log(this.state.currentNote);
      }).catch(err => {
        console.log(err);
      })
    }

    LoadNotes(id){
      axios.get('http://localhost:3100/notes?notebookId=' + id).then(res => {
        console.log(res);
        this.setState({notes:res.data});
      }).catch(err => {
         console.log(err);
      })
    }

    getHtml(){
      if(this.state.currentNote == null){
        return marked(this.state.defaultTip);
      }else{
        return marked(this.state.currentNote.body);
      }
    }

    getTitle(){
      if(this.state.currentNote == null){
        return this.state.defaultTitle;
      }else{
        return this.state.currentNote.title;
      }
    }


}

export default Note;