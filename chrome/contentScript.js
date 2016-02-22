var doc = {
    dirId: 'dirList',
    titleId: 'dirTitle',
    isShow: false,
    gapHeight: 100,
    getTitleText: function () {
        var text = '显示';
        if (this.isShow) {
            text = '隐藏';
        }
        return text + '文档结构';
    },
    buildTitleHtml: function () {
        return [
            '<div class="doc-dir-title">',
            '<a id="' + this.titleId + '" href="javascript:;">' + this.getTitleText() + '</a>',
            '</div>'
        ].join('');
    },
    buildDirHtml: function (container) {
        var ELEMENT_TYPE = 1;
        var element = document.querySelector(container);
        var dom = [];
        var childNodes = element.childNodes;
        for (var i = 0; i < childNodes.length; i++) {
            var ele = childNodes[i];
            if (ele.nodeType === ELEMENT_TYPE && /^h\d+$/i.test(ele.tagName)) {
                // 插入锚点
                var text = ele.textContent;
                var a = document.createElement('a');
                a.setAttribute('name', text);
                ele.insertBefore(a, ele.firstChild);
                // 构建当前链接目录元素结构
                var html = ['<li><a href="#' + text + '">' + text + '</a></li>'];
                var num = ele.tagName.slice(1) - 1;
                while (num) {
                    html.unshift('<ul>');
                    html.push('</ul>');
                    num--;
                }
                dom.push(html.join(''));
            }
        }
        return '<ul id="' + this.dirId + '">' + dom.join('') + '</ul>';
    },
    buildDom: function (container) {
        // 插入title
        var titleHtml = this.buildTitleHtml();
        // 插入目录元素
        var dirHtml = this.buildDirHtml(container);
        var div = document.createElement('div');
        div.setAttribute('class', 'doc-dir');
        div.innerHTML = titleHtml + dirHtml;
        document.body.appendChild(div);
        document.getElementById(this.dirId).style.display = 'none';
    },
    resize: function () {
        var dir = document.getElementById(this.dirId);
        var height = document.documentElement.clientHeight - this.gapHeight;
        if (dir) {
            dir.style.height = 'auto';
            dir.style.maxHeight = height + 'px';
        }
    },
    bindEvent: function () {
        var me = this;
        var dirTitle = document.getElementById(this.titleId);
        dirTitle.addEventListener('click', function () {
            var dir = document.getElementById(me.dirId);
            if (me.isShow) {
                dir.style.display = 'none';
            }
            else {
                dir.style.display = '';
            }
            me.isShow = !me.isShow;
            dirTitle.innerHTML = me.getTitleText();
        }, false);
    },
    init: function () {
        if (document.getElementById(this.dirId)) {
            return;
        }
        this.buildDom('.wiki');
        this.resize();
        this.bindEvent();
    }
};

var observer = {
    observeTarget: document.body,
    config: {
        attributes: true,
        childList: true,
        characterData: true,
        subtree: true
    },
    init: function (callback) {
        document.addEventListener('page:load', callback);
    }
};

window.onresize = function () {
    clearTimeout(this._resizeTimer);
    this._resizeTimer = setTimeout(doc.resize.call(doc), 500);
};

function run(mutation) {
    var wiki = document.querySelector('.wiki-holder .wiki');
    if (wiki) {
        doc.init();
    }
}

observer.init(run);
run();


