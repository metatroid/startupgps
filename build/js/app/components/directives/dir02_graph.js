angular.module('signalapp.directives')
  .directive('graph', ['$localStorage', '$timeout', 'msgSrv',
    function($localStorage, $timeout, msgSrv){
      return {
        restrict: 'A',
        link: function($scope, $element, $attrs){
          function saveSVG(){
            msgSrv.emitMsg('svgReady');
          }
          var rawData = msgSrv.getResults();

          var clickmanufacturing_arc,
              clickdevelopment_arc,
              clickcustomers_arc,
              clickdistribution_arc,
              clickcompetition_arc,
              clickbrand_arc,
              clicksales_arc,
              clicktechnical_arc,
              clickadvisory_arc,
              clickprocess_arc,
              clickmetrics_arc,
              clicklegal_arc,
              bulb,
              bulbImg;

          function removeGlows(){
            if(clickmanufacturing_arc.g){clickmanufacturing_arc.g.remove();}
            if(clickdevelopment_arc.g){clickdevelopment_arc.g.remove();}
            if(clickcustomers_arc.g){clickcustomers_arc.g.remove();}
            if(clickdistribution_arc.g){clickdistribution_arc.g.remove();}
            if(clickcompetition_arc.g){clickcompetition_arc.g.remove();}
            if(clickbrand_arc.g){clickbrand_arc.g.remove();}
            if(clicksales_arc.g){clicksales_arc.g.remove();}
            if(clicktechnical_arc.g){clicktechnical_arc.g.remove();}
            if(clickadvisory_arc.g){clickadvisory_arc.g.remove();}
            if(clickprocess_arc.g){clickprocess_arc.g.remove();}
            if(clickmetrics_arc.g){clickmetrics_arc.g.remove();}
            if(clicklegal_arc.g){clicklegal_arc.g.remove();}
          }
          //
          window.clickedSlices = window.clickedSlices||[];
          function fillOuterRing(){
            console.log(clickedSlices);
            // if(clickedSlices.includeAll(["Manufacturing", "Development"])){
            if(clickedSlices.indexOf("Manufacturing") !== -1 && clickedSlices.indexOf("Development") !== -1){
              // document.getElementById("p0").classList.add("hidden");
              document.getElementById("p0").setAttribute("class", "hidden");
              // document.getElementById("p1").classList.remove("hidden");
              document.getElementById("p1").setAttribute("class", document.getElementById("p1").getAttribute("class").replace("hidden", ""));
            }
            // if(clickedSlices.includeAll(["Customers", "Distribution", "Competition", "Brand"])){
            if(clickedSlices.indexOf("Customers") !== -1 && clickedSlices.indexOf("Distribution") !== -1 && clickedSlices.indexOf("Competition") !== -1 && clickedSlices.indexOf("Brand") !== -1){
              // document.getElementById("m0").classList.add("hidden");
              document.getElementById("m0").setAttribute("class", "hidden");
              // document.getElementById("m1").classList.remove("hidden");
              document.getElementById("m1").setAttribute("class", document.getElementById("m1").getAttribute("class").replace("hidden", ""));
            }
            // if(clickedSlices.includeAll(["Sales", "Technical", "Advisory"])){
            if(clickedSlices.indexOf("Sales") !== -1 && clickedSlices.indexOf("Technical") !== -1 && clickedSlices.indexOf("Advisory") !== -1){
              // document.getElementById("t0").classList.add("hidden");
              document.getElementById("t0").setAttribute("class", "hidden");
              // document.getElementById("t1").classList.remove("hidden");
              document.getElementById("t1").setAttribute("class", document.getElementById("t1").getAttribute("class").replace("hidden", ""));
            }
          }
          //
          var clickedSlice;
          function sliceClick(topic, slice){
            clickedSlices.push(topic);
            fillOuterRing();
            // if(clickedSlices.includeAll(["Productivity", "Metrics", "Legal"])){
            if(clickedSlices.indexOf("Productivity") !== -1 && clickedSlices.indexOf("Metrics") !== -1 && clickedSlices.indexOf("Legal") !== -1){
              // document.getElementById("o0").classList.add("hidden");
              document.getElementById("o0").setAttribute("class", "hidden");
              // document.getElementById("o1").classList.remove("hidden");
              document.getElementById("o1").setAttribute("class", document.getElementById("o1").getAttribute("class").replace("hidden", ""));
            }
            if(clickedSlice === topic){
              clickedSlice = null;
              removeGlows();
              msgSrv.emitMsg('showResults', {topic: ''});
            } else {
              topicClicked = true;
              msgSrv.emitMsg('showResults', {topic: topic});
              removeGlows();
              slice.g = slice.glow({
                color: "#fff",
                fill: true,
                width: 25,
                opacity: 0.5
              });
              clickedSlice = topic;
              $timeout(function(){
                slice.g.remove();
                clickedSlice = null;
              }, 1000);
            }
          }

          function waitForResults(){
            if(rawData.length < 1){
              rawData = msgSrv.getResults();
              $timeout(waitForResults, 500);
            } else {
              var data = [
                {
                  "data": {}
                }
              ];
              for(var i in rawData){
                data[0].data[rawData[i].topic] = Math.ceil(rawData[i].score);
              }
              //
              var paper = Raphael('graphObj');
              paper.canvas.id = "canvas";
              // var outer_circle = paper.image("/static/assets/img/outer.svg", 0, -1, 820, 820);
              //
              var outer_circle_p0 = paper.image("/static/assets/img/svg/radar map/product_off.svg", 0, -1, 820, 820);
              outer_circle_p0[0].id = "p0";
              // outer_circle_p0[0].classList.add("initial");
              outer_circle_p0[0].setAttribute("class", "initial");
              var outer_circle_p1 = paper.image("/static/assets/img/svg/radar map/product_on.svg", 0, -1, 820, 820);
              outer_circle_p1[0].id = "p1";
              // outer_circle_p1[0].classList.add("hidden");
              outer_circle_p1[0].setAttribute("class", "hidden");
              //
              var outer_circle_m0 = paper.image("/static/assets/img/svg/radar map/market_off.svg", 0, -1, 820, 820);
              outer_circle_m0[0].id = "m0";
              // outer_circle_m0[0].classList.add("initial");
              outer_circle_m0[0].setAttribute("class", "initial");
              var outer_circle_m1 = paper.image("/static/assets/img/svg/radar map/market_on.svg", 0, -1, 820, 820);
              outer_circle_m1[0].id = "m1";
              // outer_circle_m1[0].classList.add("hidden");
              outer_circle_m1[0].setAttribute("class", "hidden");
              //
              var outer_circle_t0 = paper.image("/static/assets/img/svg/radar map/team_off.svg", 0, -1, 820, 820);
              outer_circle_t0[0].id = "t0";
              // outer_circle_t0[0].classList.add("initial");
              outer_circle_t0[0].setAttribute("class", "initial");
              var outer_circle_t1 = paper.image("/static/assets/img/svg/radar map/team_on.svg", 0, -1, 820, 820);
              outer_circle_t1[0].id = "t1";
              // outer_circle_t1[0].classList.add("hidden");
              outer_circle_t1[0].setAttribute("class", "hidden");
              //
              var outer_circle_o0 = paper.image("/static/assets/img/svg/radar map/operations_off.svg", 0, -1, 820, 820);
              outer_circle_o0[0].id = "o0";
              // outer_circle_o0[0].classList.add("initial");
              outer_circle_o0[0].setAttribute("class", "initial");
              var outer_circle_o1 = paper.image("/static/assets/img/svg/radar map/operations_on.svg", 0, -1, 820, 820);
              outer_circle_o1[0].id = "o1";
              // outer_circle_o1[0].classList.add("hidden");
              outer_circle_o1[0].setAttribute("class", "hidden");
              //
              var inner_circle = paper.circle(410, 410, 290);
              inner_circle.attr('stroke', '#fff');
              inner_circle.attr('stroke-width', 10);

              var circle = paper.circle(410, 410, 285);
              // //
              var manufacturing_score = data[0].data.Manufacturing,
                  development_score = data[0].data.Development,
                  customers_score = data[0].data.Customers,
                  distribution_score = data[0].data.Distribution,
                  competition_score = data[0].data.Competition,
                  brand_score = data[0].data.Brand,
                  sales_score = data[0].data.Sales,
                  technical_score = data[0].data.Technical,
                  advisory_score = data[0].data.Advisory,
                  process_score = data[0].data.Productivity,
                  metrics_score = data[0].data['Models & Metrics'],
                  legal_score = data[0].data.Legal;
              //
              var manufacturing_total = 4,
                  development_total = 5,
                  customers_total = 5,
                  distribution_total = 3,
                  competition_total = 3,
                  brand_total = 3,
                  sales_total = 10,
                  technical_total = 10,
                  advisory_total = 6,
                  process_total = 5,
                  metrics_total = 3,
                  legal_total = 4;
              var startPointX = 410,
                  startPointY = 410,
                  radius = 286,
                  product_startAngle = 315,
                  product_endAngle = 225,
                    manufacturing_startAngle = 225,
                    manufacturing_endAngle = 270,
                    development_startAngle = 270,
                    development_endAngle = 315,
                  market_startAngle = 45,
                  market_endAngle = 315,
                    customers_startAngle = 315,
                    customers_endAngle = 337,
                    distribution_startAngle = 337,
                    distribution_endAngle = 0,
                    competition_startAngle = 0,
                    competition_endAngle = 22,
                    brand_startAngle = 22,
                    brand_endAngle = 45,
                  team_startAngle = 135,
                  team_endAngle = 45,
                    sales_startAngle = 45,
                    sales_endAngle = 80,
                    technical_startAngle = 80,
                    technical_endAngle = 115,
                    advisory_startAngle = 115,
                    advisory_endAngle = 135,
                  operations_startAngle = 225,
                  operations_endAngle = 135,
                    process_startAngle = 135,
                    process_endAngle = 165,
                    metrics_startAngle = 165,
                    metrics_endAngle = 195,
                    legal_startAngle = 195,
                    legal_endAngle = 225;
              var product_x1 = startPointX + radius * Math.cos(Math.PI * product_startAngle/180); 
              var product_y1 = startPointY + radius * Math.sin(Math.PI * product_startAngle/180);     
              var product_x2 = startPointX + radius * Math.cos(Math.PI * product_endAngle/180);
              var product_y2 = startPointY + radius * Math.sin(Math.PI * product_endAngle/180);
              var product_path = "M410,410 L" + product_x1 + "," + product_y1 + " A285,285 0 0,0 " + product_x2 + "," + product_y2 + " z";
              var product_arc = paper.path(product_path);
              product_arc.attr("stroke-width", 1);
              product_arc.attr("stroke", "#fff");
              product_arc.attr("fill", "#e1edfb");
              //
                var manufacturing_x1 = startPointX + (radius - ((manufacturing_total-manufacturing_score) * (radius/manufacturing_total))) * Math.cos(Math.PI * manufacturing_startAngle/180); 
                var manufacturing_y1 = startPointY + (radius - ((manufacturing_total-manufacturing_score) * (radius/manufacturing_total))) * Math.sin(Math.PI * manufacturing_startAngle/180);     
                var manufacturing_x2 = startPointX + (radius - ((manufacturing_total-manufacturing_score) * (radius/manufacturing_total))) * Math.cos(Math.PI * manufacturing_endAngle/180);
                var manufacturing_y2 = startPointY + (radius - ((manufacturing_total-manufacturing_score) * (radius/manufacturing_total))) * Math.sin(Math.PI * manufacturing_endAngle/180);
                var manufacturing_path = "M410,410 L" + manufacturing_x1 + "," + manufacturing_y1 + " A"+(radius - ((manufacturing_total-manufacturing_score) * (radius/manufacturing_total)))+","+(radius - ((manufacturing_total-manufacturing_score) * (radius/manufacturing_total)))+" 0 0,1 " + manufacturing_x2 + "," + manufacturing_y2 + " z";
                var manufacturing_arc = paper.path(manufacturing_path);
                manufacturing_arc.attr("stroke-width", 1);
                manufacturing_arc.attr("stroke", "#fff");
                manufacturing_arc.attr("fill", "#8bbbeb");
                //
                  for(var i2=0;i2<manufacturing_total;i2++){
                    var _manufacturing_x1 = startPointX + (radius - (i2*(radius/manufacturing_total))) * Math.cos(Math.PI * manufacturing_startAngle/180); 
                    var _manufacturing_y1 = startPointY + (radius - (i2*(radius/manufacturing_total))) * Math.sin(Math.PI * manufacturing_startAngle/180);     
                    var _manufacturing_x2 = startPointX + (radius - (i2*(radius/manufacturing_total))) * Math.cos(Math.PI * manufacturing_endAngle/180);
                    var _manufacturing_y2 = startPointY + (radius - (i2*(radius/manufacturing_total))) * Math.sin(Math.PI * manufacturing_endAngle/180);
                    var _manufacturing_path = "M410,410 L" + _manufacturing_x1 + "," + _manufacturing_y1 + " A"+(radius - (i2*(radius/manufacturing_total)))+","+(radius - (i2*(radius/manufacturing_total)))+" 0 0,1 " + _manufacturing_x2 + "," + _manufacturing_y2 + " z";
                    var _manufacturing_arc = paper.path(_manufacturing_path);
                    _manufacturing_arc.attr("stroke-width", 1);
                    _manufacturing_arc.attr("stroke", "#fff");
                  }
                //
                var clickmanufacturing_x1 = startPointX + 345 * Math.cos(Math.PI * manufacturing_startAngle/180); 
                var clickmanufacturing_y1 = startPointY + 345 * Math.sin(Math.PI * manufacturing_startAngle/180);     
                var clickmanufacturing_x2 = startPointX + 345 * Math.cos(Math.PI * manufacturing_endAngle/180);
                var clickmanufacturing_y2 = startPointY + 345 * Math.sin(Math.PI * manufacturing_endAngle/180);
                var clickmanufacturing_path = "M410,410 L" + clickmanufacturing_x1 + "," + clickmanufacturing_y1 + " A345,345 0 0,1 " + clickmanufacturing_x2 + "," + clickmanufacturing_y2 + " z";
                clickmanufacturing_arc = paper.path(clickmanufacturing_path);
                clickmanufacturing_arc.attr("stroke-width", 0);
                clickmanufacturing_arc.attr("stroke", "#fff");
                clickmanufacturing_arc.attr("fill", "#000");
                clickmanufacturing_arc.attr("fill-opacity", "0.0");
                clickmanufacturing_arc.click(function(e){
                  sliceClick("Manufacturing", this);
                });

                //
                var development_x1 = startPointX + (radius - ((development_total-development_score) * (radius/development_total))) * Math.cos(Math.PI * development_startAngle/180); 
                var development_y1 = startPointY + (radius - ((development_total-development_score) * (radius/development_total))) * Math.sin(Math.PI * development_startAngle/180);     
                var development_x2 = startPointX + (radius - ((development_total-development_score) * (radius/development_total))) * Math.cos(Math.PI * development_endAngle/180);
                var development_y2 = startPointY + (radius - ((development_total-development_score) * (radius/development_total))) * Math.sin(Math.PI * development_endAngle/180);
                var development_path = "M410,410 L" + development_x1 + "," + development_y1 + " A"+(radius - ((development_total-development_score) * (radius/development_total)))+","+(radius - ((development_total-development_score) * (radius/development_total)))+" 0 0,1 " + development_x2 + "," + development_y2 + " z";
                var development_arc = paper.path(development_path);
                development_arc.attr("stroke-width", 1);
                development_arc.attr("stroke", "#fff");
                development_arc.attr("fill", "#8bbbeb");
                //
                  for(var i3=0;i3<development_total;i3++){
                    var _development_x1 = startPointX + (radius - (i3*(radius/development_total))) * Math.cos(Math.PI * development_startAngle/180); 
                    var _development_y1 = startPointY + (radius - (i3*(radius/development_total))) * Math.sin(Math.PI * development_startAngle/180);     
                    var _development_x2 = startPointX + (radius - (i3*(radius/development_total))) * Math.cos(Math.PI * development_endAngle/180);
                    var _development_y2 = startPointY + (radius - (i3*(radius/development_total))) * Math.sin(Math.PI * development_endAngle/180);
                    var _development_path = "M410,410 L" + _development_x1 + "," + _development_y1 + " A"+(radius - (i3*(radius/development_total)))+","+(radius - (i3*(radius/development_total)))+" 0 0,1 " + _development_x2 + "," + _development_y2 + " z";
                    var _development_arc = paper.path(_development_path);
                    _development_arc.attr("stroke-width", 1);
                    _development_arc.attr("stroke", "#fff");
                  }
                //
                var clickdevelopment_x1 = startPointX + 345 * Math.cos(Math.PI * development_startAngle/180); 
                var clickdevelopment_y1 = startPointY + 345 * Math.sin(Math.PI * development_startAngle/180);     
                var clickdevelopment_x2 = startPointX + 345 * Math.cos(Math.PI * development_endAngle/180);
                var clickdevelopment_y2 = startPointY + 345 * Math.sin(Math.PI * development_endAngle/180);
                var clickdevelopment_path = "M410,410 L" + clickdevelopment_x1 + "," + clickdevelopment_y1 + " A345,345 0 0,1 " + clickdevelopment_x2 + "," + clickdevelopment_y2 + " z";
                clickdevelopment_arc = paper.path(clickdevelopment_path);
                clickdevelopment_arc.attr("stroke-width", 0);
                clickdevelopment_arc.attr("stroke", "#fff");
                clickdevelopment_arc.attr("fill", "#000");
                clickdevelopment_arc.attr("fill-opacity", "0.0");
                clickdevelopment_arc.click(function(e){
                  sliceClick("Development", this);
                });
                //
              var market_x1 = startPointX + radius * Math.cos(Math.PI * market_startAngle/180); 
              var market_y1 = startPointY + radius * Math.sin(Math.PI * market_startAngle/180);     
              var market_x2 = startPointX + radius * Math.cos(Math.PI * market_endAngle/180);
              var market_y2 = startPointY + radius * Math.sin(Math.PI * market_endAngle/180);
              var market_path = "M410,410 L" + market_x1 + "," + market_y1 + " A285,285 0 0,0 " + market_x2 + "," + market_y2 + " z";
              var market_arc = paper.path(market_path);
              market_arc.attr("stroke-width", 1);
              market_arc.attr("stroke", "#fff");
              market_arc.attr("fill", "#fff4c8");
              //
                var customers_x1 = startPointX + (radius - ((customers_total-customers_score) * (radius/customers_total))) * Math.cos(Math.PI * customers_startAngle/180); 
                var customers_y1 = startPointY + (radius - ((customers_total-customers_score) * (radius/customers_total))) * Math.sin(Math.PI * customers_startAngle/180);     
                var customers_x2 = startPointX + (radius - ((customers_total-customers_score) * (radius/customers_total))) * Math.cos(Math.PI * customers_endAngle/180);
                var customers_y2 = startPointY + (radius - ((customers_total-customers_score) * (radius/customers_total))) * Math.sin(Math.PI * customers_endAngle/180);
                var customers_path = "M410,410 L" + customers_x1 + "," + customers_y1 + " A"+(radius - ((customers_total-customers_score) * (radius/customers_total)))+","+(radius - ((customers_total-customers_score) * (radius/customers_total)))+" 0 0,1 " + customers_x2 + "," + customers_y2 + " z";
                var customers_arc = paper.path(customers_path);
                customers_arc.attr("stroke-width", 1);
                customers_arc.attr("stroke", "#fff");
                customers_arc.attr("fill", "#ffcf2a");
                //
                  for(var i4=0;i4<customers_total;i4++){
                    var _customers_x1 = startPointX + (radius - (i4*(radius/customers_total))) * Math.cos(Math.PI * customers_startAngle/180); 
                    var _customers_y1 = startPointY + (radius - (i4*(radius/customers_total))) * Math.sin(Math.PI * customers_startAngle/180);     
                    var _customers_x2 = startPointX + (radius - (i4*(radius/customers_total))) * Math.cos(Math.PI * customers_endAngle/180);
                    var _customers_y2 = startPointY + (radius - (i4*(radius/customers_total))) * Math.sin(Math.PI * customers_endAngle/180);
                    var _customers_path = "M410,410 L" + _customers_x1 + "," + _customers_y1 + " A"+(radius - (i4*(radius/customers_total)))+","+(radius - (i4*(radius/customers_total)))+" 0 0,1 " + _customers_x2 + "," + _customers_y2 + " z";
                    var _customers_arc = paper.path(_customers_path);
                    _customers_arc.attr("stroke-width", 1);
                    _customers_arc.attr("stroke", "#fff");
                  }
                //
                var clickcustomers_x1 = startPointX + 345 * Math.cos(Math.PI * customers_startAngle/180); 
                var clickcustomers_y1 = startPointY + 345 * Math.sin(Math.PI * customers_startAngle/180);     
                var clickcustomers_x2 = startPointX + 345 * Math.cos(Math.PI * customers_endAngle/180);
                var clickcustomers_y2 = startPointY + 345 * Math.sin(Math.PI * customers_endAngle/180);
                var clickcustomers_path = "M410,410 L" + clickcustomers_x1 + "," + clickcustomers_y1 + " A345,345 0 0,1 " + clickcustomers_x2 + "," + clickcustomers_y2 + " z";
                clickcustomers_arc = paper.path(clickcustomers_path);
                clickcustomers_arc.attr("stroke-width", 0);
                clickcustomers_arc.attr("stroke", "#fff");
                clickcustomers_arc.attr("fill", "#000");
                clickcustomers_arc.attr("fill-opacity", "0.0");
                clickcustomers_arc.click(function(e){
                  sliceClick("Customers", this);
                });
                //
                var distribution_x1 = startPointX + (radius - ((distribution_total-distribution_score) * (radius/distribution_total))) * Math.cos(Math.PI * distribution_startAngle/180); 
                var distribution_y1 = startPointY + (radius - ((distribution_total-distribution_score) * (radius/distribution_total))) * Math.sin(Math.PI * distribution_startAngle/180);     
                var distribution_x2 = startPointX + (radius - ((distribution_total-distribution_score) * (radius/distribution_total))) * Math.cos(Math.PI * distribution_endAngle/180);
                var distribution_y2 = startPointY + (radius - ((distribution_total-distribution_score) * (radius/distribution_total))) * Math.sin(Math.PI * distribution_endAngle/180);
                var distribution_path = "M410,410 L" + distribution_x1 + "," + distribution_y1 + " A"+(radius - ((distribution_total-distribution_score) * (radius/distribution_total)))+","+(radius - ((distribution_total-distribution_score) * (radius/distribution_total)))+" 0 0,1 " + distribution_x2 + "," + distribution_y2 + " z";
                var distribution_arc = paper.path(distribution_path);
                distribution_arc.attr("stroke-width", 1);
                distribution_arc.attr("stroke", "#fff");
                distribution_arc.attr("fill", "#ffcf2a");
                //
                  for(var i5=0;i5<distribution_total;i5++){
                    var _distribution_x1 = startPointX + (radius - (i5*(radius/distribution_total))) * Math.cos(Math.PI * distribution_startAngle/180); 
                    var _distribution_y1 = startPointY + (radius - (i5*(radius/distribution_total))) * Math.sin(Math.PI * distribution_startAngle/180);     
                    var _distribution_x2 = startPointX + (radius - (i5*(radius/distribution_total))) * Math.cos(Math.PI * distribution_endAngle/180);
                    var _distribution_y2 = startPointY + (radius - (i5*(radius/distribution_total))) * Math.sin(Math.PI * distribution_endAngle/180);
                    var _distribution_path = "M410,410 L" + _distribution_x1 + "," + _distribution_y1 + " A"+(radius - (i5*(radius/distribution_total)))+","+(radius - (i5*(radius/distribution_total)))+" 0 0,1 " + _distribution_x2 + "," + _distribution_y2 + " z";
                    var _distribution_arc = paper.path(_distribution_path);
                    _distribution_arc.attr("stroke-width", 1);
                    _distribution_arc.attr("stroke", "#fff");
                  }
                //
                var clickdistribution_x1 = startPointX + 345 * Math.cos(Math.PI * distribution_startAngle/180); 
                var clickdistribution_y1 = startPointY + 345 * Math.sin(Math.PI * distribution_startAngle/180);     
                var clickdistribution_x2 = startPointX + 345 * Math.cos(Math.PI * distribution_endAngle/180);
                var clickdistribution_y2 = startPointY + 345 * Math.sin(Math.PI * distribution_endAngle/180);
                var clickdistribution_path = "M410,410 L" + clickdistribution_x1 + "," + clickdistribution_y1 + " A345,345 0 0,1 " + clickdistribution_x2 + "," + clickdistribution_y2 + " z";
                clickdistribution_arc = paper.path(clickdistribution_path);
                clickdistribution_arc.attr("stroke-width", 0);
                clickdistribution_arc.attr("stroke", "#fff");
                clickdistribution_arc.attr("fill", "#000");
                clickdistribution_arc.attr("fill-opacity", "0.0");
                clickdistribution_arc.click(function(e){
                  sliceClick("Distribution", this);
                });
                //
                var competition_x1 = startPointX + (radius - ((competition_total-competition_score) * (radius/competition_total))) * Math.cos(Math.PI * competition_startAngle/180); 
                var competition_y1 = startPointY + (radius - ((competition_total-competition_score) * (radius/competition_total))) * Math.sin(Math.PI * competition_startAngle/180);     
                var competition_x2 = startPointX + (radius - ((competition_total-competition_score) * (radius/competition_total))) * Math.cos(Math.PI * competition_endAngle/180);
                var competition_y2 = startPointY + (radius - ((competition_total-competition_score) * (radius/competition_total))) * Math.sin(Math.PI * competition_endAngle/180);
                var competition_path = "M410,410 L" + competition_x1 + "," + competition_y1 + " A"+(radius - ((competition_total-competition_score) * (radius/competition_total)))+","+(radius - ((competition_total-competition_score) * (radius/competition_total)))+" 0 0,1 " + competition_x2 + "," + competition_y2 + " z";
                var competition_arc = paper.path(competition_path);
                competition_arc.attr("stroke-width", 1);
                competition_arc.attr("stroke", "#fff");
                competition_arc.attr("fill", "#ffcf2a");
                //
                  for(var i6=0;i6<competition_total;i6++){
                    var _competition_x1 = startPointX + (radius - (i6*(radius/competition_total))) * Math.cos(Math.PI * competition_startAngle/180); 
                    var _competition_y1 = startPointY + (radius - (i6*(radius/competition_total))) * Math.sin(Math.PI * competition_startAngle/180);     
                    var _competition_x2 = startPointX + (radius - (i6*(radius/competition_total))) * Math.cos(Math.PI * competition_endAngle/180);
                    var _competition_y2 = startPointY + (radius - (i6*(radius/competition_total))) * Math.sin(Math.PI * competition_endAngle/180);
                    var _competition_path = "M410,410 L" + _competition_x1 + "," + _competition_y1 + " A"+(radius - (i6*(radius/competition_total)))+","+(radius - (i6*(radius/competition_total)))+" 0 0,1 " + _competition_x2 + "," + _competition_y2 + " z";
                    var _competition_arc = paper.path(_competition_path);
                    _competition_arc.attr("stroke-width", 1);
                    _competition_arc.attr("stroke", "#fff");
                  }
                //
                var clickcompetition_x1 = startPointX + 345 * Math.cos(Math.PI * competition_startAngle/180); 
                var clickcompetition_y1 = startPointY + 345 * Math.sin(Math.PI * competition_startAngle/180);     
                var clickcompetition_x2 = startPointX + 345 * Math.cos(Math.PI * competition_endAngle/180);
                var clickcompetition_y2 = startPointY + 345 * Math.sin(Math.PI * competition_endAngle/180);
                var clickcompetition_path = "M410,410 L" + clickcompetition_x1 + "," + clickcompetition_y1 + " A345,345 0 0,1 " + clickcompetition_x2 + "," + clickcompetition_y2 + " z";
                clickcompetition_arc = paper.path(clickcompetition_path);
                clickcompetition_arc.attr("stroke-width", 0);
                clickcompetition_arc.attr("stroke", "#fff");
                clickcompetition_arc.attr("fill", "#000");
                clickcompetition_arc.attr("fill-opacity", "0.0");
                clickcompetition_arc.click(function(e){
                  sliceClick("Competition", this);
                });
                //
                var brand_x1 = startPointX + (radius - ((brand_total-brand_score) * (radius/brand_total))) * Math.cos(Math.PI * brand_startAngle/180); 
                var brand_y1 = startPointY + (radius - ((brand_total-brand_score) * (radius/brand_total))) * Math.sin(Math.PI * brand_startAngle/180);     
                var brand_x2 = startPointX + (radius - ((brand_total-brand_score) * (radius/brand_total))) * Math.cos(Math.PI * brand_endAngle/180);
                var brand_y2 = startPointY + (radius - ((brand_total-brand_score) * (radius/brand_total))) * Math.sin(Math.PI * brand_endAngle/180);
                var brand_path = "M410,410 L" + brand_x1 + "," + brand_y1 + " A"+(radius - ((brand_total-brand_score) * (radius/brand_total)))+","+(radius - ((brand_total-brand_score) * (radius/brand_total)))+" 0 0,1 " + brand_x2 + "," + brand_y2 + " z";
                var brand_arc = paper.path(brand_path);
                brand_arc.attr("stroke-width", 1);
                brand_arc.attr("stroke", "#fff");
                brand_arc.attr("fill", "#ffcf2a");
                //
                  for(var i7=0;i7<brand_total;i7++){
                    var _brand_x1 = startPointX + (radius - (i7*(radius/brand_total))) * Math.cos(Math.PI * brand_startAngle/180); 
                    var _brand_y1 = startPointY + (radius - (i7*(radius/brand_total))) * Math.sin(Math.PI * brand_startAngle/180);     
                    var _brand_x2 = startPointX + (radius - (i7*(radius/brand_total))) * Math.cos(Math.PI * brand_endAngle/180);
                    var _brand_y2 = startPointY + (radius - (i7*(radius/brand_total))) * Math.sin(Math.PI * brand_endAngle/180);
                    var _brand_path = "M410,410 L" + _brand_x1 + "," + _brand_y1 + " A"+(radius - (i7*(radius/brand_total)))+","+(radius - (i7*(radius/brand_total)))+" 0 0,1 " + _brand_x2 + "," + _brand_y2 + " z";
                    var _brand_arc = paper.path(_brand_path);
                    _brand_arc.attr("stroke-width", 1);
                    _brand_arc.attr("stroke", "#fff");
                  }
                //
                var clickbrand_x1 = startPointX + 345 * Math.cos(Math.PI * brand_startAngle/180); 
                var clickbrand_y1 = startPointY + 345 * Math.sin(Math.PI * brand_startAngle/180);     
                var clickbrand_x2 = startPointX + 345 * Math.cos(Math.PI * brand_endAngle/180);
                var clickbrand_y2 = startPointY + 345 * Math.sin(Math.PI * brand_endAngle/180);
                var clickbrand_path = "M410,410 L" + clickbrand_x1 + "," + clickbrand_y1 + " A345,345 0 0,1 " + clickbrand_x2 + "," + clickbrand_y2 + " z";
                clickbrand_arc = paper.path(clickbrand_path);
                clickbrand_arc.attr("stroke-width", 0);
                clickbrand_arc.attr("stroke", "#fff");
                clickbrand_arc.attr("fill", "#000");
                clickbrand_arc.attr("fill-opacity", "0.0");
                clickbrand_arc.click(function(e){
                  sliceClick("Brand", this);
                });
                //
              var team_x1 = startPointX + radius * Math.cos(Math.PI * team_startAngle/180); 
              var team_y1 = startPointY + radius * Math.sin(Math.PI * team_startAngle/180);     
              var team_x2 = startPointX + radius * Math.cos(Math.PI * team_endAngle/180);
              var team_y2 = startPointY + radius * Math.sin(Math.PI * team_endAngle/180);
              var team_path = "M410,410 L" + team_x1 + "," + team_y1 + " A285,285 0 0,0 " + team_x2 + "," + team_y2 + " z";
              var team_arc = paper.path(team_path);
              team_arc.attr("stroke-width", 1);
              team_arc.attr("stroke", "#fff");
              team_arc.attr("fill", "#e4f9f8");
              //
                var sales_x1 = startPointX + (radius - ((sales_total-sales_score) * (radius/sales_total))) * Math.cos(Math.PI * sales_startAngle/180); 
                var sales_y1 = startPointY + (radius - ((sales_total-sales_score) * (radius/sales_total))) * Math.sin(Math.PI * sales_startAngle/180);     
                var sales_x2 = startPointX + (radius - ((sales_total-sales_score) * (radius/sales_total))) * Math.cos(Math.PI * sales_endAngle/180);
                var sales_y2 = startPointY + (radius - ((sales_total-sales_score) * (radius/sales_total))) * Math.sin(Math.PI * sales_endAngle/180);
                var sales_path = "M410,410 L" + sales_x1 + "," + sales_y1 + " A"+(radius - ((sales_total-sales_score) * (radius/sales_total)))+","+(radius - ((sales_total-sales_score) * (radius/sales_total)))+" 0 0,1 " + sales_x2 + "," + sales_y2 + " z";
                var sales_arc = paper.path(sales_path);
                sales_arc.attr("stroke-width", 1);
                sales_arc.attr("stroke", "#fff");
                sales_arc.attr("fill", "#97eae6");
                //
                  for(var i8=0;i8<sales_total;i8++){
                    var _sales_x1 = startPointX + (radius - (i8*(radius/sales_total))) * Math.cos(Math.PI * sales_startAngle/180); 
                    var _sales_y1 = startPointY + (radius - (i8*(radius/sales_total))) * Math.sin(Math.PI * sales_startAngle/180);     
                    var _sales_x2 = startPointX + (radius - (i8*(radius/sales_total))) * Math.cos(Math.PI * sales_endAngle/180);
                    var _sales_y2 = startPointY + (radius - (i8*(radius/sales_total))) * Math.sin(Math.PI * sales_endAngle/180);
                    var _sales_path = "M410,410 L" + _sales_x1 + "," + _sales_y1 + " A"+(radius - (i8*(radius/sales_total)))+","+(radius - (i8*(radius/sales_total)))+" 0 0,1 " + _sales_x2 + "," + _sales_y2 + " z";
                    var _sales_arc = paper.path(_sales_path);
                    _sales_arc.attr("stroke-width", 1);
                    _sales_arc.attr("stroke", "#fff");
                  }
                //
                var clicksales_x1 = startPointX + 345 * Math.cos(Math.PI * sales_startAngle/180); 
                var clicksales_y1 = startPointY + 345 * Math.sin(Math.PI * sales_startAngle/180);     
                var clicksales_x2 = startPointX + 345 * Math.cos(Math.PI * sales_endAngle/180);
                var clicksales_y2 = startPointY + 345 * Math.sin(Math.PI * sales_endAngle/180);
                var clicksales_path = "M410,410 L" + clicksales_x1 + "," + clicksales_y1 + " A345,345 0 0,1 " + clicksales_x2 + "," + clicksales_y2 + " z";
                clicksales_arc = paper.path(clicksales_path);
                clicksales_arc.attr("stroke-width", 0);
                clicksales_arc.attr("stroke", "#fff");
                clicksales_arc.attr("fill", "#000");
                clicksales_arc.attr("fill-opacity", "0.0");
                clicksales_arc.click(function(e){
                  sliceClick("Sales", this);
                });
                //
                var technical_x1 = startPointX + (radius - ((technical_total-technical_score) * (radius/technical_total))) * Math.cos(Math.PI * technical_startAngle/180); 
                var technical_y1 = startPointY + (radius - ((technical_total-technical_score) * (radius/technical_total))) * Math.sin(Math.PI * technical_startAngle/180);     
                var technical_x2 = startPointX + (radius - ((technical_total-technical_score) * (radius/technical_total))) * Math.cos(Math.PI * technical_endAngle/180);
                var technical_y2 = startPointY + (radius - ((technical_total-technical_score) * (radius/technical_total))) * Math.sin(Math.PI * technical_endAngle/180);
                var technical_path = "M410,410 L" + technical_x1 + "," + technical_y1 + " A"+(radius - ((technical_total-technical_score) * (radius/technical_total)))+","+(radius - ((technical_total-technical_score) * (radius/technical_total)))+" 0 0,1 " + technical_x2 + "," + technical_y2 + " z";
                var technical_arc = paper.path(technical_path);
                technical_arc.attr("stroke-width", 1);
                technical_arc.attr("stroke", "#fff");
                technical_arc.attr("fill", "#97eae6");
                //
                  for(var i9=0;i9<technical_total;i9++){
                    var _technical_x1 = startPointX + (radius - (i9*(radius/technical_total))) * Math.cos(Math.PI * technical_startAngle/180); 
                    var _technical_y1 = startPointY + (radius - (i9*(radius/technical_total))) * Math.sin(Math.PI * technical_startAngle/180);     
                    var _technical_x2 = startPointX + (radius - (i9*(radius/technical_total))) * Math.cos(Math.PI * technical_endAngle/180);
                    var _technical_y2 = startPointY + (radius - (i9*(radius/technical_total))) * Math.sin(Math.PI * technical_endAngle/180);
                    var _technical_path = "M410,410 L" + _technical_x1 + "," + _technical_y1 + " A"+(radius - (i9*(radius/technical_total)))+","+(radius - (i9*(radius/technical_total)))+" 0 0,1 " + _technical_x2 + "," + _technical_y2 + " z";
                    var _technical_arc = paper.path(_technical_path);
                    _technical_arc.attr("stroke-width", 1);
                    _technical_arc.attr("stroke", "#fff");
                  }
                //
                var clicktechnical_x1 = startPointX + 345 * Math.cos(Math.PI * technical_startAngle/180); 
                var clicktechnical_y1 = startPointY + 345 * Math.sin(Math.PI * technical_startAngle/180);     
                var clicktechnical_x2 = startPointX + 345 * Math.cos(Math.PI * technical_endAngle/180);
                var clicktechnical_y2 = startPointY + 345 * Math.sin(Math.PI * technical_endAngle/180);
                var clicktechnical_path = "M410,410 L" + clicktechnical_x1 + "," + clicktechnical_y1 + " A345,345 0 0,1 " + clicktechnical_x2 + "," + clicktechnical_y2 + " z";
                clicktechnical_arc = paper.path(clicktechnical_path);
                clicktechnical_arc.attr("stroke-width", 0);
                clicktechnical_arc.attr("stroke", "#fff");
                clicktechnical_arc.attr("fill", "#000");
                clicktechnical_arc.attr("fill-opacity", "0.0");
                clicktechnical_arc.click(function(e){
                  sliceClick("Technical", this);
                });
                //
                var advisory_x1 = startPointX + (radius - ((advisory_total-advisory_score) * (radius/advisory_total))) * Math.cos(Math.PI * advisory_startAngle/180); 
                var advisory_y1 = startPointY + (radius - ((advisory_total-advisory_score) * (radius/advisory_total))) * Math.sin(Math.PI * advisory_startAngle/180);     
                var advisory_x2 = startPointX + (radius - ((advisory_total-advisory_score) * (radius/advisory_total))) * Math.cos(Math.PI * advisory_endAngle/180);
                var advisory_y2 = startPointY + (radius - ((advisory_total-advisory_score) * (radius/advisory_total))) * Math.sin(Math.PI * advisory_endAngle/180);
                var advisory_path = "M410,410 L" + advisory_x1 + "," + advisory_y1 + " A"+(radius - ((advisory_total-advisory_score) * (radius/advisory_total)))+","+(radius - ((advisory_total-advisory_score) * (radius/advisory_total)))+" 0 0,1 " + advisory_x2 + "," + advisory_y2 + " z";
                var advisory_arc = paper.path(advisory_path);
                advisory_arc.attr("stroke-width", 1);
                advisory_arc.attr("stroke", "#fff");
                advisory_arc.attr("fill", "#97eae6");
                //
                  for(var i10=0;i10<advisory_total;i10++){
                    var _advisory_x1 = startPointX + (radius - (i10*(radius/advisory_total))) * Math.cos(Math.PI * advisory_startAngle/180); 
                    var _advisory_y1 = startPointY + (radius - (i10*(radius/advisory_total))) * Math.sin(Math.PI * advisory_startAngle/180);     
                    var _advisory_x2 = startPointX + (radius - (i10*(radius/advisory_total))) * Math.cos(Math.PI * advisory_endAngle/180);
                    var _advisory_y2 = startPointY + (radius - (i10*(radius/advisory_total))) * Math.sin(Math.PI * advisory_endAngle/180);
                    var _advisory_path = "M410,410 L" + _advisory_x1 + "," + _advisory_y1 + " A"+(radius - (i10*(radius/advisory_total)))+","+(radius - (i10*(radius/advisory_total)))+" 0 0,1 " + _advisory_x2 + "," + _advisory_y2 + " z";
                    var _advisory_arc = paper.path(_advisory_path);
                    _advisory_arc.attr("stroke-width", 1);
                    _advisory_arc.attr("stroke", "#fff");
                  }
                //
                var clickadvisory_x1 = startPointX + 345 * Math.cos(Math.PI * advisory_startAngle/180); 
                var clickadvisory_y1 = startPointY + 345 * Math.sin(Math.PI * advisory_startAngle/180);     
                var clickadvisory_x2 = startPointX + 345 * Math.cos(Math.PI * advisory_endAngle/180);
                var clickadvisory_y2 = startPointY + 345 * Math.sin(Math.PI * advisory_endAngle/180);
                var clickadvisory_path = "M410,410 L" + clickadvisory_x1 + "," + clickadvisory_y1 + " A345,345 0 0,1 " + clickadvisory_x2 + "," + clickadvisory_y2 + " z";
                clickadvisory_arc = paper.path(clickadvisory_path);
                clickadvisory_arc.attr("stroke-width", 0);
                clickadvisory_arc.attr("stroke", "#fff");
                clickadvisory_arc.attr("fill", "#000");
                clickadvisory_arc.attr("fill-opacity", "0.0");
                clickadvisory_arc.click(function(e){
                  sliceClick("Advisory", this);
                });
                //
              var operations_x1 = startPointX + radius * Math.cos(Math.PI * operations_startAngle/180); 
              var operations_y1 = startPointY + radius * Math.sin(Math.PI * operations_startAngle/180);     
              var operations_x2 = startPointX + radius * Math.cos(Math.PI * operations_endAngle/180);
              var operations_y2 = startPointY + radius * Math.sin(Math.PI * operations_endAngle/180);
              var operations_path = "M410,410 L" + operations_x1 + "," + operations_y1 + " A285,285 0 0,0 " + operations_x2 + "," + operations_y2 + " z";
              var operations_arc = paper.path(operations_path);
              operations_arc.attr("stroke-width", 1);
              operations_arc.attr("stroke", "#fff");
              operations_arc.attr("fill", "#f6e9d3");
              //
                var process_x1 = startPointX + (radius - ((process_total-process_score) * (radius/process_total))) * Math.cos(Math.PI * process_startAngle/180); 
                var process_y1 = startPointY + (radius - ((process_total-process_score) * (radius/process_total))) * Math.sin(Math.PI * process_startAngle/180);     
                var process_x2 = startPointX + (radius - ((process_total-process_score) * (radius/process_total))) * Math.cos(Math.PI * process_endAngle/180);
                var process_y2 = startPointY + (radius - ((process_total-process_score) * (radius/process_total))) * Math.sin(Math.PI * process_endAngle/180);
                var process_path = "M410,410 L" + process_x1 + "," + process_y1 + " A"+(radius - ((process_total-process_score) * (radius/process_total)))+","+(radius - ((process_total-process_score) * (radius/process_total)))+" 0 0,1 " + process_x2 + "," + process_y2 + " z";
                var process_arc = paper.path(process_path);
                process_arc.attr("stroke-width", 1);
                process_arc.attr("stroke", "#fff");
                process_arc.attr("fill", "#dea754");
                //
                  for(var i11=0;i11<process_total;i11++){
                    var _process_x1 = startPointX + (radius - (i11*(radius/process_total))) * Math.cos(Math.PI * process_startAngle/180); 
                    var _process_y1 = startPointY + (radius - (i11*(radius/process_total))) * Math.sin(Math.PI * process_startAngle/180);     
                    var _process_x2 = startPointX + (radius - (i11*(radius/process_total))) * Math.cos(Math.PI * process_endAngle/180);
                    var _process_y2 = startPointY + (radius - (i11*(radius/process_total))) * Math.sin(Math.PI * process_endAngle/180);
                    var _process_path = "M410,410 L" + _process_x1 + "," + _process_y1 + " A"+(radius - (i11*(radius/process_total)))+","+(radius - (i11*(radius/process_total)))+" 0 0,1 " + _process_x2 + "," + _process_y2 + " z";
                    var _process_arc = paper.path(_process_path);
                    _process_arc.attr("stroke-width", 1);
                    _process_arc.attr("stroke", "#fff");
                  }
                //
                var clickprocess_x1 = startPointX + 345 * Math.cos(Math.PI * process_startAngle/180); 
                var clickprocess_y1 = startPointY + 345 * Math.sin(Math.PI * process_startAngle/180);     
                var clickprocess_x2 = startPointX + 345 * Math.cos(Math.PI * process_endAngle/180);
                var clickprocess_y2 = startPointY + 345 * Math.sin(Math.PI * process_endAngle/180);
                var clickprocess_path = "M410,410 L" + clickprocess_x1 + "," + clickprocess_y1 + " A345,345 0 0,1 " + clickprocess_x2 + "," + clickprocess_y2 + " z";
                clickprocess_arc = paper.path(clickprocess_path);
                clickprocess_arc.attr("stroke-width", 0);
                clickprocess_arc.attr("stroke", "#fff");
                clickprocess_arc.attr("fill", "#000");
                clickprocess_arc.attr("fill-opacity", "0.0");
                clickprocess_arc.click(function(e){
                  sliceClick("Productivity", this);
                });
                //
                var metrics_x1 = startPointX + (radius - ((metrics_total-metrics_score) * (radius/metrics_total))) * Math.cos(Math.PI * metrics_startAngle/180); 
                var metrics_y1 = startPointY + (radius - ((metrics_total-metrics_score) * (radius/metrics_total))) * Math.sin(Math.PI * metrics_startAngle/180);     
                var metrics_x2 = startPointX + (radius - ((metrics_total-metrics_score) * (radius/metrics_total))) * Math.cos(Math.PI * metrics_endAngle/180);
                var metrics_y2 = startPointY + (radius - ((metrics_total-metrics_score) * (radius/metrics_total))) * Math.sin(Math.PI * metrics_endAngle/180);
                var metrics_path = "M410,410 L" + metrics_x1 + "," + metrics_y1 + " A"+(radius - ((metrics_total-metrics_score) * (radius/metrics_total)))+","+(radius - ((metrics_total-metrics_score) * (radius/metrics_total)))+" 0 0,1 " + metrics_x2 + "," + metrics_y2 + " z";
                var metrics_arc = paper.path(metrics_path);
                metrics_arc.attr("stroke-width", 1);
                metrics_arc.attr("stroke", "#fff");
                metrics_arc.attr("fill", "#dea754");
                //
                  for(var i12=0;i12<metrics_total;i12++){
                    var _metrics_x1 = startPointX + (radius - (i12*(radius/metrics_total))) * Math.cos(Math.PI * metrics_startAngle/180); 
                    var _metrics_y1 = startPointY + (radius - (i12*(radius/metrics_total))) * Math.sin(Math.PI * metrics_startAngle/180);     
                    var _metrics_x2 = startPointX + (radius - (i12*(radius/metrics_total))) * Math.cos(Math.PI * metrics_endAngle/180);
                    var _metrics_y2 = startPointY + (radius - (i12*(radius/metrics_total))) * Math.sin(Math.PI * metrics_endAngle/180);
                    var _metrics_path = "M410,410 L" + _metrics_x1 + "," + _metrics_y1 + " A"+(radius - (i12*(radius/metrics_total)))+","+(radius - (i12*(radius/metrics_total)))+" 0 0,1 " + _metrics_x2 + "," + _metrics_y2 + " z";
                    var _metrics_arc = paper.path(_metrics_path);
                    _metrics_arc.attr("stroke-width", 1);
                    _metrics_arc.attr("stroke", "#fff");
                  }
                //
                var clickmetrics_x1 = startPointX + 345 * Math.cos(Math.PI * metrics_startAngle/180); 
                var clickmetrics_y1 = startPointY + 345 * Math.sin(Math.PI * metrics_startAngle/180);     
                var clickmetrics_x2 = startPointX + 345 * Math.cos(Math.PI * metrics_endAngle/180);
                var clickmetrics_y2 = startPointY + 345 * Math.sin(Math.PI * metrics_endAngle/180);
                var clickmetrics_path = "M410,410 L" + clickmetrics_x1 + "," + clickmetrics_y1 + " A345,345 0 0,1 " + clickmetrics_x2 + "," + clickmetrics_y2 + " z";
                clickmetrics_arc = paper.path(clickmetrics_path);
                clickmetrics_arc.attr("stroke-width", 0);
                clickmetrics_arc.attr("stroke", "#fff");
                clickmetrics_arc.attr("fill", "#000");
                clickmetrics_arc.attr("fill-opacity", "0.0");
                clickmetrics_arc.click(function(e){
                  sliceClick("Metrics", this);
                });
                //
                var legal_x1 = startPointX + (radius - ((legal_total-legal_score) * (radius/legal_total))) * Math.cos(Math.PI * legal_startAngle/180); 
                var legal_y1 = startPointY + (radius - ((legal_total-legal_score) * (radius/legal_total))) * Math.sin(Math.PI * legal_startAngle/180);     
                var legal_x2 = startPointX + (radius - ((legal_total-legal_score) * (radius/legal_total))) * Math.cos(Math.PI * legal_endAngle/180);
                var legal_y2 = startPointY + (radius - ((legal_total-legal_score) * (radius/legal_total))) * Math.sin(Math.PI * legal_endAngle/180);
                var legal_path = "M410,410 L" + legal_x1 + "," + legal_y1 + " A"+(radius - ((legal_total-legal_score) * (radius/legal_total)))+","+(radius - ((legal_total-legal_score) * (radius/legal_total)))+" 0 0,1 " + legal_x2 + "," + legal_y2 + " z";
                var legal_arc = paper.path(legal_path);
                legal_arc.attr("stroke-width", 1);
                legal_arc.attr("stroke", "#fff");
                legal_arc.attr("fill", "#dea754");
                //
                  for(var i13=0;i13<legal_total;i13++){
                    var _legal_x1 = startPointX + (radius - (i13*(radius/legal_total))) * Math.cos(Math.PI * legal_startAngle/180); 
                    var _legal_y1 = startPointY + (radius - (i13*(radius/legal_total))) * Math.sin(Math.PI * legal_startAngle/180);     
                    var _legal_x2 = startPointX + (radius - (i13*(radius/legal_total))) * Math.cos(Math.PI * legal_endAngle/180);
                    var _legal_y2 = startPointY + (radius - (i13*(radius/legal_total))) * Math.sin(Math.PI * legal_endAngle/180);
                    var _legal_path = "M410,410 L" + _legal_x1 + "," + _legal_y1 + " A"+(radius - (i13*(radius/legal_total)))+","+(radius - (i13*(radius/legal_total)))+" 0 0,1 " + _legal_x2 + "," + _legal_y2 + " z";
                    var _legal_arc = paper.path(_legal_path);
                    _legal_arc.attr("stroke-width", 1);
                    _legal_arc.attr("stroke", "#fff");
                  }
                //

                //
                var clicklegal_x1 = startPointX + 345 * Math.cos(Math.PI * legal_startAngle/180); 
                var clicklegal_y1 = startPointY + 345 * Math.sin(Math.PI * legal_startAngle/180);     
                var clicklegal_x2 = startPointX + 345 * Math.cos(Math.PI * legal_endAngle/180);
                var clicklegal_y2 = startPointY + 345 * Math.sin(Math.PI * legal_endAngle/180);
                var clicklegal_path = "M410,410 L" + clicklegal_x1 + "," + clicklegal_y1 + " A345,345 0 0,1 " + clicklegal_x2 + "," + clicklegal_y2 + " z";
                clicklegal_arc = paper.path(clicklegal_path);
                clicklegal_arc.attr("stroke-width", 0);
                clicklegal_arc.attr("stroke", "#fff");
                clicklegal_arc.attr("fill", "#000");
                clicklegal_arc.attr("fill-opacity", "0.0");
                clicklegal_arc.click(function(e){
                  sliceClick("Legal", this);
                });
                //
              bulb = paper.circle(410, 410, 25);
              bulb[0].id = "bulb";
              bulb.attr('stroke', '#fff');
              bulb.attr('stroke-width', 2);
              bulb.attr('fill', '#eb2c15');
              bulbImg = paper.image("/static/assets/img/bulb.svg", 401, 396, 18, 29);
              bulbImg[0].id = "bulbImg";
              //
              // bulbImg.click(function(e){
              //   $scope.interpretModalActive = true;
              // });
              //
              var glow = function(){
                this.g = this.glow({
                  color: "#fff",
                  fill: true,
                  width: 25,
                  opacity: 0.5
                });
              };
              var unglow = function(){
                this.g.remove();
              };
              clickmanufacturing_arc.hover(glow, unglow);
              clickdevelopment_arc.hover(glow, unglow);
              clickcustomers_arc.hover(glow, unglow);
              clickdistribution_arc.hover(glow, unglow);
              clickcompetition_arc.hover(glow, unglow);
              clickbrand_arc.hover(glow, unglow);
              clicksales_arc.hover(glow, unglow);
              clicktechnical_arc.hover(glow, unglow);
              clickadvisory_arc.hover(glow, unglow);
              clickprocess_arc.hover(glow, unglow);
              clickmetrics_arc.hover(glow, unglow);
              clicklegal_arc.hover(glow, unglow);
              //
              saveSVG();
              //
              $timeout(function(){
                slice = clicklegal_arc;
                // flashSlice();
              }, 500);
            }
            fillOuterRing();
          }
          waitForResults();
        }
      };
    }
  ])
;