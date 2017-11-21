import React,{ Component} from 'react';
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom';
import {ajax} from 'api/ajax.js';

import appComponentManage from 'api/appComponentManager.js'
import WgtPanel from '../components/WgtPanel/WgtPanel';

import "./index.css"
class WorkSpace extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            allData: {},
            metaData: {},
            changeData:{},
            data_params:{}
        }
        this.initThemes();
    }
    /**
     *
     */
    componentWillMount(){
        //debugger;
        if(window.data_params){
            var data_param = $summer.strToJson(window.data_params);
            this.setState({
                data_params: data_param
            })
        }

    }

    componentDidMount() {
        this.init();

    }

    initThemes(){
        let defaultThemeesPath = "../static/themes/default/css/iuapmobile.um.css";
        let selThemesPath = localStorage.getItem("selThemes");
        if(selThemesPath){
            defaultThemeesPath = selThemesPath;
        }
        let link = document.querySelector("#themeslink");
        if(link){
            if(selThemesPath){
                link.setAttribute("href", defaultThemeesPath);
            }
        }else{
            let head = document.getElementsByTagName('head')[0];
            let newlink = document.createElement('link');
            newlink.id = "themeslink";
            newlink.href = defaultThemeesPath;
            newlink.rel = 'stylesheet';
            newlink.type = 'text/css';
            head.appendChild(newlink);
        }
        
    }

    init = () => {
        if ($summer.os == 'pc') {
            this.getData();
        } else {
            summer.on("ready", this.getData);
        }
    }

    getData = () => {
        let _this = this;
        // 这里应该是上一个页面传过来的
        let id = this.state.data_params && this.state.data_params.id ? this.state.data_params.id : 4;
        ajax({
            "type": "get",
            //"url": "/user/find",
            "url": "/userlink/getContactsDetails",
            "param":{
                "meta": JSON.stringify({
                    "clientType": $summer.os,
                    "componentId":"card001"
                }),
                "id":id
            },
        },function(data){
            if(data.flag == 0){
                let allData = data.data;
                _this.setState({
                    allData: allData
                });

                let metaData = data.metaData;
                _this.setState({
                    metaData: metaData
                });
            }

        },function(res){
            console.log(res);
        });
    }

    closeFn =() => {
        appComponentManager.closeComponent({
            componentId: "cardView"
        });
    }

    save = () => {
        let data = this.state.changeData;

    }

    changeFn = (allD) => {
        alert("开发中...")
    }

    switchThemes = ()=> {
        let link = document.querySelector("#themeslink");
        let href = link.getAttribute("href");
      
        let curT = href.split('static/themes/')[1].split('/')[0];
        let Ts = ["default","red","orange","blue","green","gray","blue2"];
        
        let newT = Ts.splice(Ts.indexOf(curT)-1,1);
        let news = `../static/themes/${newT}/css/iuapmobile.um.css`;
        link.setAttribute("href", news);
        localStorage.setItem("selThemes",news);
    }
    render() {
        return (
            <div className="um-win">
                <div className="um-header">

                    <h3>我的工作台</h3>
                    <a href="#" className="um-header-right icon-jindou" onClick={this.switchThemes}>切换主题</a>
                </div>
                <div className="um-content">
                    <WgtPanel data={this.state.allData} metaData={this.state.metaData} changeFn = {this.changeFn}/>
                </div>
                <div className="um-footer">

                </div>
            </div>
        )
    }
}

ReactDOM.render(<WorkSpace/>, document.querySelector("#app"))
