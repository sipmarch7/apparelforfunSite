let product = document.querySelectorAll(".productImage");
let gallery = document.querySelectorAll(".productGallery");
let slideshow = document.querySelectorAll(".productSlideshow");
let answer = document.querySelectorAll(".answer");
let dlt = document.querySelectorAll(".deleteBtn");

document.addEventListener('DOMContentLoaded', (event) => {
    var hidden = document.querySelectorAll('.yesOrNo');
    hidden.forEach(item=>{
        var parent = item.parentNode;
        var answer = parent.querySelector(".answer");
        changeColor(answer, item.value);
    })
});

answer.forEach(item=>{
    item.addEventListener("click", ()=>{
        var parent = item.parentNode;
        var hidden = parent.querySelector("input");
        changeColor(item, changeValue(hidden));
    })
});

dlt.forEach(item=>{
    item.addEventListener("mouseup", ()=>{
        setTimeout(function(){
            turnToSubmit(item);
            setTimeout(function(){turnToButton(item)},4000);
        }, 100);
    });
});


function turnToSubmit(item){
    item.setAttribute("type",'submit');
    item.setAttribute("class",'w-100 btn btn-danger deleteBtn');
    item.innerHTML="Forever?";
}

function turnToButton(item){
    item.setAttribute("type",'button');
    item.setAttribute("class",'w-100 btn btn-outline-danger deleteBtn');
    item.innerHTML="DELETE";
}

function changeValue(input){
    if (input.value=="1"){
        input.value=0;
        return 0;
    }
    input.value=1;
    return 1;
}

function changeColor(input, indicator){
    var green = input.querySelector(".yesSpan");
    var red = input.querySelector(".noSpan");
    if (indicator=="1"){
        green.style.backgroundColor="green"
        green.style.color="white"
        red.style.backgroundColor="white"
        red.style.color="black"
    }else{
        green.style.backgroundColor="white"
        green.style.color="black"
        red.style.backgroundColor="red"
        red.style.color="white"
    }
}