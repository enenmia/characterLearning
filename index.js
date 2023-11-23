import { symbolArray } from './data.js';

var draggables = document.querySelectorAll('.draggable');
var selectedElement = null;
var offsetX, offsetY;
var delayDragging = false; // 用于控制延迟拖动的标志
let x=0;
let y=0;

// var guidanceButton = document.getElementById('guidanceBtn'); 
// var finishCreationBtn = document.getElementById('finishCreationButton'); 

document.addEventListener('DOMContentLoaded', function() {
  var guidanceButton = document.getElementById('guidanceBtn'); 
  var finishCreationBtn = document.getElementById('finishCreationButton'); 
  var submitBtn = document.getElementById('submitbutton'); 

  if (window.location.pathname.endsWith('page1.html')) {
    var currentIndex = parseInt(localStorage.getItem('currentWordIndex')) || 0;
    var currentWord = symbolArray[currentIndex].name;
    document.getElementById('wordgoal').textContent = `${currentWord}`;
}

    if (window.location.pathname.endsWith('page2.html')) {
        var currentIndex = parseInt(localStorage.getItem('currentWordIndex')) || 0;
        var currentWord = symbolArray[currentIndex].name;
        var reminderPrompt = document.getElementById('reminder'); 
        displayImagesBasedOnCurrentWord();
        reminderPrompt.textContent=`Create your symbol that means 「${currentWord}」.`

    }

if (window.location.pathname.endsWith('page3.html')) {
    var state = JSON.parse(localStorage.getItem('pageState'));

    var currentIndex = parseInt(localStorage.getItem('currentWordIndex')) || 0;
    var currentChinese = symbolArray[currentIndex].chinese;
    document.getElementById('realcharacter').textContent = `${currentChinese}`;

    const imageContainer = document.getElementById('canvas-area');
    imageContainer.innerHTML = ''; // 清除现有内容

    if (state) {
        Object.keys(state).forEach(function(id) {
            const imgElement = document.createElement('img');
            imgElement.id = id;
            imgElement.classList.add('draggable');
            imgElement.src = `images/${id.split('-').slice(1).join('.')}`; // 从id重建文件名
            imgElement.style.left = state[id].left;
            imgElement.style.top = state[id].top;
            imgElement.style.position = 'absolute';
            imageContainer.appendChild(imgElement);
        });
    }
}


  if (guidanceButton) {
      guidanceButton.addEventListener('click', function() {
          window.location.href = 'page2.html';
      });
  }

  if (finishCreationBtn) {
    finishCreationBtn.addEventListener('click', function() {
        // captureAndDownload(function() {
        //     // 下载完成后，跳转到新页面
            window.location.href = 'page3.html';
        // });
    });
}
if (submitBtn){
    submitBtn.addEventListener('click', function(){
        var currentIndex = parseInt(localStorage.getItem('currentWordIndex')) || 0;
        // var nextIndex = (currentIndex + 1) % symbolArray.length; 
        var nextIndex = currentIndex + 1;

        // 检查是否完成了所有单词
        if (nextIndex >= symbolArray.length) {
            // 如果完成了所有单词，跳转到结束界面
            window.location.href = 'endpage.html';
        } else {
            // 否则，保存下一个单词的索引并跳转到page1.html
            localStorage.setItem('currentWordIndex', nextIndex);
            window.location.href = 'page1.html';
        }
    });
}
});

function displayImagesBasedOnCurrentWord() {
    // 获取当前单词的索引
    const currentIndex = parseInt(localStorage.getItem('currentWordIndex')) || 0;

    // 获取当前单词对象
    const currentWordObject = symbolArray[currentIndex];

    // 获取当前单词的图片列表
    const imagesToDisplay = currentWordObject.components;

    const imageContainer = document.getElementById('toolkit-area');

    // 清除之前的内容
    imageContainer.innerHTML = '';

    // 为每个图片组件创建一个 img 元素并添加到容器中

    imagesToDisplay.forEach(imageFileName => {
        const imgElement = document.createElement('img');
        imgElement.src = `images/${imageFileName}`;
        imgElement.alt = imageFileName;
        imgElement.classList.add('draggable');
        // imgElement.id =`comp${imageFileName}` // 确保每个元素有一个唯一的ID
        imgElement.id = 'comp-' + imageFileName.replace('.', '-');

        imageContainer.appendChild(imgElement);

        // 为新元素设置拖拽事件
        setupDraggable(imgElement);
    });
    // imageContainer.innerHTML += `
    // <div id="prompt">            
    //     <div id="prompt-line1">
    //         <p>Click and drag the component to </p>
    //         <img src="images/canvas-small.png" id="canvas-small">
    //     </div>
    //     <p>to create your symbol means ‘wood’ </p>
    // </div>`;
}

function captureAndDownload(callback) {
  var canvasArea = document.getElementById('canvas-area');
  html2canvas(canvasArea).then(function(canvas) {
      var link = document.createElement('a');
      link.download = 'creation.png';
      link.href = canvas.toDataURL('image/png');
      link.click();

      // 调用回调函数
      if (callback) callback();
  }).catch(function(error) {
      console.error('Error capturing canvas:', error);
  });
}

draggables.forEach(function(img) {
    img.addEventListener('mousedown', function(e) {
        if (delayDragging) {
            // 如果处于延迟状态，则不执行操作
            return;
        }

        // 设置延迟，防止快速连续点击
        delayDragging = true;
        setTimeout(function() {
            delayDragging = false;
        }, 200); // 设置200毫秒的延迟

        // 处理拖动逻辑
        handleDrag(e, img);
    });
});

function handleDrag(e, img) {
    if (!selectedElement) {
        // 开始拖动
        selectedElement = img;
        selectedElement.style.zIndex = 10; // 提高 z-index
        offsetX = e.clientX - selectedElement.getBoundingClientRect().left;
        offsetY = e.clientY - selectedElement.getBoundingClientRect().top;
        document.addEventListener('mousemove', mouseMove);
    } else if (selectedElement === img) {
        // 放置图片
        selectedElement.style.zIndex = 2; // 恢复 z-index
        document.removeEventListener('mousemove', mouseMove);
        
        selectedElement = null;
        // document.getElementById('canvas').innerHTML+=`
        // <>`;
        
    }
}

function mouseMove(e) {
    if (!selectedElement) return;
    selectedElement.style.position = 'absolute';
    selectedElement.style.left = e.clientX - offsetX + 'px';
    // x=selectedElement.style.left;
    selectedElement.style.top = e.clientY - offsetY + 'px';
    // y=selectedElement.style.top;
}
document.getElementById('finishCreationButton').addEventListener('click', function() {
    var state = captureState();
    localStorage.setItem('pageState', JSON.stringify(state));
    window.location.href = 'page3.html'; // 新页面的 URL
});

function captureState() {
    var state = {};
    var draggables = document.querySelectorAll('.draggable');

    var initialDraggables = document.querySelectorAll('.draggable');
   
    // initialDraggables.forEach(setupDraggable);
    draggables.forEach(function(img) {
        state[img.id] = {
            left: img.style.left,
            top: img.style.top
        };
    });
    return state;
}
function setupDraggable(img) {
    img.addEventListener('mousedown', function(e) {
        if (delayDragging) {
            return;
        }
        delayDragging = true;
        setTimeout(function() {
            delayDragging = false;
        }, 200);

        // 处理拖动逻辑
        handleDrag(e, img);
    });
}
