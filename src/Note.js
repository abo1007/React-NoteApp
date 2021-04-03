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
            currentNoteID:null,
            defaultTip:"## 空指针",
            defaultTitle:"新建笔记",
            isOnComposition:true
        }
    }

    componentDidMount(){
        this.getNoteData();

    }
    
    render(){
        let notebooks = this.state.notebooks;
        let state = this.state;
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
          { this.state.notebooks.length == 0 ?
            <p className="filetitle"></p>
            :
            <p className="filetitle">{state.notebooks[state.currentBookIndex].name}</p>

          }

          
          <div className="itemlist">
            {
              this.state.notes.map((item, index) => (
                <div className="page" key={item.id}>
                  <div className={this.getClassName(item.id)} onClick={() => this.handleEditNote(item.id)}>
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
            { this.state.currentNote ?  
              <input type="text"
                    name="title"
                    value={this.state.currentNote.title} 
                    onChange={e => this.handleFieldChange('title', e.target.value)}
                    onKeyDown={e => this.handleTextKeydown(e)}/>
              : 
              <input type="text" defaultValue=""/>
            }
          </div>
        </div>
        <div className="bot">
          <div className="ed">
            { this.state.currentNote ? 
              <textarea id="text" 
              name="body"
              value={this.state.currentNote.body} 
              onChange={e => this.handleFieldChange('body', e.target.value)} 
              onKeyDown={e => this.handleTextKeydown(e)}
              // onCompositionEnd = {e => this.handleComposition(e)} 
              // onCompositionStart = {e => this.handleComposition(e)}
              ></textarea>
              :
              <textarea id="text" defaultValue=""></textarea>
            }
          </div>
            { this.state.currentNote ? 
              <div className="md text markdown-body" dangerouslySetInnerHTML={{__html:marked(this.state.currentNote.body)}}></div>
              :
              <div className="md text markdown-body" dangerouslySetInnerHTML={{__html:""}}></div>
            }
        </div>
      </div>
    </div>
        )
    }

    getNoteData(){
      axios.get('http://localhost:3100/notebooks').then(res => {
        this.setState({notebooks:res.data});
        console.log(this.state.notebooks);
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
        datetime:this.dateFormat(),
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

    handleFieldChange(name, value){

      let note = this.state.currentNote;
      note[name] = value;
      this.setState({ note: note});
        
      this.putNotes(note);
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

    // handleComposition(e){
    //   console.log(e.type);
    //   if (e.type === 'compositionend') {
    //     this.setState({isOnComposition:false});
    //     this.handleFieldChange(e);
    //   } else {
    //     this.setState({isOnComposition:true});
    //     this.handleFieldChange(e);
    //   }
    // }

    getClassName(id){
      if(this.state.currentNote && this.state.currentNote.id == id){
        return 'borad borad-active';
      }
      return 'borad';
    }

    reloadNotes(id){
      let book = this.state.notebooks[this.state.currentBookIndex];
      this.LoadNotes(book.id);
    }

    putNotes(note){
      axios.put('http://localhost:3100/notes/' + note.id, note).then(res => {
        // this.reloadNotes();
        this.updateNoteFinish(note)
      }).catch(err => {
        console.log(err);
      });
    }

    updateNoteFinish(note) {
      var notes = this.state.notes;
      var index = notes.findIndex(o => o.id === note.id);
      if (index !== -1) {
        notes[index] = note;
      }
      this.setState({ notes: notes });
    }

    handleTextKeydown(e) {
      if (e.keyCode === 9) {
        var el = e.target;
        e.preventDefault();
        var selectionStartPos = el.selectionStart;
        var selectionEndPos = el.selectionEnd;
        var oldContent = el.value;
  
        el.value = oldContent.substring(0, selectionStartPos) + '\t' +
            oldContent.substring(selectionEndPos);
        el.selectionStart = el.selectionEnd = selectionStartPos + 1;
      }
    }

    dateFormat(){
      let date = new Date();
      let month = (date.getMonth() + 1).toString();
      let day = date.getDate().toString();
      let hour = date.getHours().toString();
      let minutes = date.getMinutes().toString();
      if(minutes.length == 1){
        minutes = "0" + minutes;
      }
      return month + "-" + day+" " + hour + ":" + minutes;
    }
}

export default Note;