function makeUnique(array, links){
  var tmpArr = [],
      skipped = 0,
      previouslySkipped = array.length - links.length -20;
  array.forEach(function(item){
    var compare = item.title;
    var duplicate = false;
    tmpArr.forEach(function(i){
      if(compare === i.title){
        duplicate = true;
      }
    });
    if(!duplicate){
      tmpArr.push(item);
    } else {
      skipped++;
    }
  });
  var skipping = skipped - previouslySkipped;
  return {r: tmpArr, n: skipping};
}
Array.prototype.clean = function(deleteValue) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == deleteValue) {         
      this.splice(i, 1);
      i--;
    }
  }
  return this;
};
function extractAnswers(data){
  var output = [];
  for(var q in data){
    var other;
    var resp = data[q].user_response;
    var tmp = [];
    if(typeof(resp.length) === "undefined"){
      for(var u in resp){
        tmp.push(resp[u].answer_text);
      }
    } else {
      tmp = data[q].user_response.map(function(r){return r.answer_text;});
      other = data[q].user_response.map(function(r){return r.answer_text_other;}).clean();
      other = other.length ? other : undefined;
    }
    var qObj = {
      id: q,
      question: data[q].question,
      answer: tmp,
      other: other
    };
    output.push(qObj);
  }
  return output;
}
Array.prototype.getIndexBy = function(name, value){
  for(var i=0;i<this.length;i++){
    if(this[i][name] == value){
      return i;
    }
  }
  return -1;
};
Array.prototype.getThemeByName = function(value){
  for(var i=0;i<this.length;i++){
    if(this[i].name == value){
      return this[i];
    }
  }
  return -1;
};
function getThemeFromTopic(topic){
  switch (topic) {
    case "Impact":
    case "Venture":
    case "Crowdfunding":
    case "Grants":
    case "impact":
    case "venture":
    case "crowdfunding":
    case "grants":
      return "Funding";
    case "Productivity":
    case "Models & Metrics":
    case "Models_Metrics":
    case "Legal":
    case "productivity":
    case "models & metrics":
    case "models_metrics":
    case "legal":
      return "Operations";
    case "Brand":
    case "Competition":
    case "Distribution":
    case "Customers":
    case "brand":
    case "competition":
    case "distribution":
    case "customers":
      return "Market";
    case "Advisory":
    case "Culture":
    case "Sales":
    case "Technical":
    case "advisory":
    case "culture":
    case "sales":
    case "technical":
      return "Team";
    case "Development":
    case "Manufacturing":
    case "development":
    case "manufacturing":
      return "Product";
    default:
      return "";
  }
}
function waitForEl(selector, fn){
  var el = document.querySelectorAll(selector)[0];
  if(typeof el === 'undefined' || el.length < 1){
    setTimeout(function(){waitForEl(selector, fn);}, 500);
  } else {
    fn();
  }
}
Array.prototype.removeValue = function(name, value){
 var array = this.map(function(v,i){
    return v[name] === value ? null : v;
 });
 this.length = 0;
 var that = this;
 for(var n = 0;n<array.length;n++){
  if(array[n]){
    that.push(array[n]);
  }
 }
};
var generateNewFinderCode = function(){
  var code = Date.now();
  code = ''+code;
  code = code.substring(0, code.length-1);
  code = code.match(/.{1,4}/g);
  tmp = '';
  code.forEach(function(n,i){
    tmp += parseInt(n).toString(16);
  });
  code = tmp.toLowerCase();
  return code;
};

var combineTags = function(a, b){
  var combined = '';
  if(a){
    combined += a;
    if(b){
      combined += ",";
    }
  }
  if(b){
    combined += b;
  }
  return combined;
};

var getDataByTopic = function(data, topic){
  var info = {
    score: 0,
    scores: [],
    sector: [],
    customer_type: [],
    product_category: []
  };
  for(var item in data){
    if((data[item].topic && data[item].topic.name === topic) || (data[item].resources_topic && data[item].resources_topic.name === topic) || (data[item].other_topic && data[item].other_topic.name === topic)){
      if(data[item].weight && data[item].total_possible && data[item].possible){
        info.score += (data[item].score/data[item].possible) * ((data[item].weight/100)*data[item].total_possible);
      } else {
        info.score += data[item].score;
      }
      if(data[item].score){info.scores.push(data[item].score>5?5:data[item].score);}
      if(data[item].sector){info.sector.push(data[item].sector);}
      if(data[item].customer_type){info.customer_type.push(data[item].customer_type);}
      if(data[item].product_category){info.product_category.push(data[item].product_category);}
    }
  }
  return info;
};