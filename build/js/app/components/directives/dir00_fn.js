Array.prototype.includeAll = function(values){
  var includes = true;
  for(var i=0;i<values.length;i++){
    if(!this.includes(values[i])){
      includes = false;
    }
  }
  return values.length > 0 && includes;
};
var smoothScroll = function(element, options){
  options = options || {};
  var duration = 800,
      offset = options.offset || 0;

  var easing = function(n){
    return n < 0.5 ? 8 * Math.pow(n, 4) : 1 - 8 * (--n) * Math.pow(n, 3);
  };

  var getScrollLocation = function(){
    return window.pageYOffset ? window.pageYOffset : document.documentElement.scrollTop;
  };

  setTimeout(function(){
    var startLocation = getScrollLocation(),
        timeLapsed = 0,
        percentage, position;

    var getEndLocation = function(element){
      var location = 0;
      if(element.offsetParent){
        do {
          location += element.offsetTop;
          element = element.offsetParent;
        } while (element);
      }
      location = Math.max(location - offset, 0);
      return location;
    };

    var endLocation = getEndLocation(element);
    var distance = endLocation - startLocation;

    var stopAnimation = function(){
      var currentLocation = getScrollLocation();
      if(position == endLocation || currentLocation == endLocation || ((window.innerHeight + currentLocation) >= document.body.scrollHeight)){
        clearInterval(runAnimation);
      }
    };

    var animateScroll = function(){
      timeLapsed += 16;
      percentage = (timeLapsed / duration);
      percentage = (percentage > 1) ? 1 : percentage;
      position = startLocation + (distance * easing(percentage));
      window.scrollTo(0, position);
      stopAnimation();
    };

    var runAnimation = setInterval(animateScroll, 16);
  }, 0);
};

function showLoadingSpinner(container){
  var el = document.querySelector(container);
  el.innerHTML = "<div class='loading'><img src='/static/assets/img/load.svg' alt='Loading'></div>";
}
function clearLoadingSpinner(container){
  var el = document.querySelector(container),
      l = el.querySelector('.loading');
  if(l){l.remove();}
}
function scrollToTop(){
  document.querySelector('body').scrollTop = 0;
  return false;
}