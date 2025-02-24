		
$('.sub-menu ul').hide();
$(".sub-menu a").click(function () {
	$(this).parent(".sub-menu").children("ul").slideToggle("100");
	$(this).find(".right").toggleClass("fa-angle-up fa-angle-down");
});


window.onscroll = function() {myFunction()};

var header = document.getElementById("tableheader");
var sticky = header.offsetTop;

function myFunction() {
  if (window.pageYOffset > sticky) {
    header.classList.add("tablehdfixd");
  } else {
    header.classList.remove("tablehdfixd");
  }
}