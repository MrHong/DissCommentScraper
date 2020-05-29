// ==UserScript==
// @name         ComentScrappper
// @namespace    http://mr-hong.codes/
// @version      0.1
// @description  Gets Coments from business-gazeta
// @author       mrhong
// @match        https://www.business-gazeta.ru/*
// @grant              GM_addStyle
// @grant              GM_xmlhttpRequest
// @require     https://raw.githubusercontent.com/eligrey/FileSaver.js/master/dist/FileSaver.js
// ==/UserScript==

(function() {
    'use strict';

    class CComment {
        constructor(username, date, orderdate, indent, text) {
            this.username = username;
            this.date = date;
            this.orderdate = orderdate;
            this.indent = indent;
            this.text = text;
            this.subs = [];
        }

        getText(){
            var text = this.orderdate.toString();
            text+= '\t';
            text+= this.date;
            text+= '\t';
            text+= this.indent.toString();
            text+= '\t';
            text+= this.username;
            text+= '\t';
            text+= this.text;
            text+= '\r\n';
            return text;
        }

        getTextIdent(){
            var text = this.orderdate.toString();
            text+= '\t';
            text+= this.date;
            text+= '\t';
            text+= this.indent.toString();
            text+= '\t';
            text+= '  '.repeat(this.indent);
            text+= this.username;
            text+= '\t';
            text+= this.text;
            text+= '\r\n';
            return text;
        }

        getTextMarkdown(){
            var text = "";
            text+= '    '.repeat(this.indent);
            text+= '* **';
            text+= this.username;
            text+= '**\t(';
            text+= this.orderdate.toString();
            text+= ')\t[';
            text+= this.indent.toString();
            text+= ']\t';
            text+= this.date;
            text+= '\r\n';
            text+= '    '.repeat(this.indent + 1);
            text+= '> ';
            text+= this.text;
            text+= '\r\n\r\n';
            return text;
        }


        getTextWithSubs(){
            var text = this.getTextMarkdown();
            this.subs.forEach(function(sub) {
                text += sub.getTextWithSubs();
            });
            return text;
        }

    }

    Element.prototype.parents = function(selector) {
        // Vanilla JS jQuery.parents() realisation
        // https://gist.github.com/ziggi/2f15832b57398649ee9b

        var elements = [];
        var elem = this;
        var ishaveselector = selector !== undefined;

        while ((elem = elem.parentElement) !== null) {
            if (elem.nodeType !== Node.ELEMENT_NODE) {
                continue;
            }

            if (!ishaveselector || elem.matches(selector)) {
                elements.push(elem);
            }
        }

        return elements;
    };

    function AddInfo(stext, eparent){
        var _p_dinfo = document.createElement('p');
        _p_dinfo.innerHTML =stext;
        eparent.appendChild(_p_dinfo);
    }

    var fReadCommentData = function (element, ident) {
        var commentdata;


        var elementName = element.querySelector("div.comment-user__data > span");
        if(!(elementName)){
            elementName = element.querySelector("div.comment-user__data > a > b");
        }
        var spanDate = element.querySelector("div.comment-user__data > div > span");
        var pText = element.querySelector("p");

        var orderpt = parseInt(element.getAttribute("data-public-time"),10);
        var d = new Date(orderpt);

        if(pText && elementName && spanDate){
            commentdata = new CComment(elementName.innerHTML, spanDate.innerHTML, orderpt, ident, pText.innerHTML);
        }
        return commentdata;
    }

    var fReadCommentTree = function (element, ident) {
        var tree = element.querySelector("ul.comment-tree");
        var treeinfo = [];
        console.log(ident);
        if(tree){
            var listitems = tree.children;
            if(listitems){
                for (var i = 0; i < listitems.length; i++) {
                    var comment = fReadCommentData(listitems[i], ident);
                    if(comment){
                        treeinfo.push(comment);
                        comment.subs = fReadCommentTree(listitems[i], ident + 1);
                    }
                }
            }
            else{
                console.log("No subs!");
            }
        }
        if(treeinfo){
            treeinfo.sort(function(c1, c2){
                return c1.orderdate - c2.orderdate;
            });
        }

        return treeinfo;
    }

    var _downloadinfo = document.createElement('div');
    _downloadinfo.className += 'DownloadInfo';

    var comments_head = document.querySelector("div.comments-head");
    var comments_body = document.querySelector("div.comments-body");
    var comments_boxbext = document.querySelector("#comments > div.comments-body > div")

    if(comments_head && comments_body && comments_boxbext){

        var _p_dinfo = document.createElement('p');
        _p_dinfo.innerHTML =
            'Downloadinfo:';
        _downloadinfo.appendChild(_p_dinfo);
        comments_head.appendChild(_downloadinfo);

        var treeinfo = fReadCommentTree(comments_boxbext, 0);
        //AddInfo( treeinfo, _downloadinfo);
        if(treeinfo){
            var fulltext = "Subtext:\r\n";
            treeinfo.forEach(function(comment) {
                fulltext+= comment.getTextWithSubs();
                //fulltext+= comment.getText();
            });
            var blob = new Blob([fulltext], {type: "text/plain;charset=utf-8"});

            saveAs(blob, "result.txt");
        }
    }


})();
