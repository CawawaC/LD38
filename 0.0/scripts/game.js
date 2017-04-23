var /*pause = false, */pauseTime = false, pauseMovement = false, paused = false;
var nombreDeFormesDomestiquesInitiales = 5;
var vieillesse = true, vieillissementRapide = 0;
var prairie;
//var traceDePrairie;
var date;

var score;

var textCompteARebours;
var compte = 4000;
var formeGlisse;

var boutonDePause;
var menu;

var largeurCanvas;
var hauteurCanvas;

var texteTutoriel, texteScore;

var dropAutorise = true;

paper.install(window);
window.onload = function ()
{
    date = new Date();
    score = 0;
    
    largeurCanvas = document.getElementById("gameCanvas").width;
    hauteurCanvas = document.getElementById("gameCanvas").height;
    prairie = {x: largeurCanvas/2, y: hauteurCanvas*3/4, rayon:120};

	// setup paper JS
	paper.setup('gameCanvas');
	var tool = new Tool();

	// variables et objets
	var mousePoint = view.center;
    var timerCompteARebours = setInterval(changeCompteARebours, 100);
    
    class Bouton {
        constructor(x, y, largeur, hauteur) {
            this.trace = new Group();

            this.traceDePause(0, 0, largeur, hauteur);
            
            this.trace.position.x = x;
            this.trace.position.y = y;
        }
        
        traceDePause(x, y, largeur, hauteur) {
            this.trace.removeChildren();
            
            var bg = new Path();
            var figure1 = new Path();
            var figure2 = new Path();
            
            bg.close = true;
            figure1.closed = true;
            figure2.close = true;

            bg = new Path.Rectangle(new Point(0, 0), new Point(largeur, hauteur));
            
            var offsetx = 0;
            figure1 = new Path.Rectangle(new Point(0, 0), new Point(10, hauteur));
            figure2 = new Path.Rectangle(new Point(0, 0), new Point(10, hauteur));
            figure2.position.x = 32;

            bg.fillColor = "white"; 
            bg.fillColor.alpha = 0.01;
            figure1.fillColor = "white";
            figure2.fillColor = "white";

            this.trace.addChild(bg);
            this.trace.addChild(figure1);
            this.trace.addChild(figure2)
        }
        
        traceDeLosange() {
            for (var i = 0; i < points; i++) {
                var delta = new Point({
                    length: largeur/2,
                    angle: (360 / points) * i
                });
                figure.add(delta);
            }
        }
        
        traceDeRectangle(x, y, largeur, hauteur) {
            var figure = new Path();
            
            var from = new Point(0, 0);
            var to = new Point(largeur, hauteur);
            figure = new Path.Rectangle(from, to);
            
            figure.fillColor = "white";
            this.trace.removeChildren();
            this.trace.addChild(figure);
            
            this.trace.position.x = x;
            this.trace.position.y = y;
        }
        
        mouseDown(mousePoint) {	
            if(!this.trace.visible) return false;
            
            var hitResult = this.trace.hitTest(mousePoint, {
                segments: true,
                stroke: true,
                fill: true,
                tolerance: 5});
//            console.assert(!hitResult, "click");
            return hitResult;
        }
    }
    
    boutonDePause = new Bouton(300, 100, 30, 50);
    menu = new Bouton(50, 50, 300, 500);
    menu.trace.visible = false;
    menu.traceDeRectangle(200, 400, 300, 500);
    
    texteTutoriel = new paper.PointText(new paper.Point(80, 180));
    texteTutoriel.fillColor = 'red';
    texteTutoriel.visible = false;
    texteTutoriel.content  = "Gloubi blouga";
    
    texteScore = new paper.PointText(new paper.Point(80, 180));
    texteScore.fillColor = 'red';
    texteScore.content  = "Score: 0";
    
   //traceDePrairie = tracerLaPrairie();
    
    function renouvelerFormeSauvage() {
//        formeSauvage.destroy();
        formeSauvage.formeAleatoire();
        formeSauvage.trace01.position.x =largeurCanvas/2;
        formeSauvage.trace01.position.y =150;
        
        //TweenVersGauche();
    }
    
    function changeCompteARebours() { 
        if(!pauseTime) {
            compte -= 100;
    //            textCompteARebours.content = (5-Math.floor(compte/10))+" : "+(9-compte%10); 
            textCompteARebours.content = Math.floor(compte/1000) + ":" + Math.floor(compte%1000)/100;
            if(compte == 0)
            {
              pauseTime = true;
                /* renouvelerFormeSauvage();
                resetCompteARebours();*/
                TweenVersGauche();
            }
        }
    }
    
    function resetCompteARebours() {
        clearInterval(timerCompteARebours);
        timerCompteARebours = setInterval(changeCompteARebours, 100);
        compte = 4000;
    }
    
    textCompteARebours = new paper.PointText(new paper.Point(100,100));
//    console.info(compte);
//    console.info(textCompteARebours.hasFill());
    textCompteARebours.fillColor = 'white';
    textCompteARebours.content = '0';

    
    var formeSauvage = Forme();
    formeSauvage = new Forme();
	formeSauvage.create();
    formeSauvage.touchable=false;
    formeSauvage.trace01.position.x =largeurCanvas/2;
    formeSauvage.trace01.position.y =150;
    
    var groupeDomestique = [];
    
    for (var i = 0; i < nombreDeFormesDomestiquesInitiales; i++)
    {
        var formeDomestique = new Forme();
        formeDomestique.creerFormeDomestique();
        formeDomestique.placerDansLaPrairie();
        groupeDomestique.push(formeDomestique);
    }
    
	// paper JS event mouse
	tool.onMouseMove = function(event)
	{
		mousePoint = event.point;
	}
    
    tool.onMouseDown = function(event)
	{
        mouseDownTemps = date.getTime();
        
        if(boutonDePause.mouseDown(event.point)) {
           if(paused)
               finirPause();
            else
                commencerPause();
            
            toggleMenu();
        }
        
        else if(formeSauvage.mouseDown(event.point)) {
            
            var f = formeSauvage;
            jouerUnSonDeForme([
                [f.indexDeForme[2], 2, f.indexDeCouleur],
                [f.indexDeForme[1], 1, f.indexDeCouleur],
                [f.indexDeForme[0], 0, f.indexDeCouleur]
            ]);
        }
        
         for (var i = groupeDomestique.length-1; i>=0; i--)
        {
            groupeDomestique[i].mouseDown(event.point);
//            if(groupeDomestique[i].mouseDown(event.point))
//                console.info("fs");
            
            if( groupeDomestique[i].glisse)
            {
                groupeDomestique[i].trace01.bringToFront();
                var f = groupeDomestique[i];
                jouerUnSonDeForme([
                    [f.indexDeForme[2], 2, f.indexDeCouleur],
                    [f.indexDeForme[1], 1, f.indexDeCouleur],
                    [f.indexDeForme[0], 0, f.indexDeCouleur]
                ]);

                formeGlisse = groupeDomestique[i];
                
                break;
            } 
        }
	}
    
     tool.onMouseUp = function(event)
     {
         deltaTemps = mouseDownTemps - date.getTime();
         

        var hitResult;

        hitResult = formeSauvage.trace01.hitTest(event.point, {
            segments: true,
            stroke: true,
            fill: true,
            tolerance: 5
        });

         if (hitResult && dropAutorise) {   
             if(formeGlisse != null) {
                 var scoreLocal = formeGlisse.estSimilaireA(formeSauvage);
                if(scoreLocal > 0)
                {
                    console.log("bon drop");
                    groupeDomestique.push(formeSauvage.domesticationDeLaSauvage());
                    if(!formeGlisse.estDansLaPrairie()) formeGlisse.ramenerDansLaPrairie();
                    formeGlisse.mouseUp(event.point);
                    
                    score += scoreLocal;
                    texteScore.content = "Score: "+score;
                    console.log(score);
                } else {
                    console.log("mauvais drop");
                    //kill formeglisse
                    var index = groupeDomestique.indexOf(formeGlisse);
                    groupeDomestique[index].destroy();
                    groupeDomestique.splice(index, 1);
                    formeGlisse.meurs();
                    formeSauvage.destroy();
//                    groupeDomestique[index].destroy();
                }
//              formeGlisse.destroy();

//                formeGlisse.destroy();
               /* resetCompteARebours();
                renouvelerFormeSauvage();*/
                 TweenVersCentreRetardee();
             }
         } else if(formeGlisse != null) {
            if(!formeGlisse.estDansLaPrairie()) formeGlisse.ramenerDansLaPrairie();
            formeGlisse.mouseUp(event.point);
         }
	}
		
	//paper JS event enter frame
	view.onFrame = function (event)
	{
		//formeDomestique.update(mousePoint);
       /* for (var i = 0; i<groupeDomestique.length; i++)
        {
           
            if( groupeDomestique[i].trace01.children.length ==0)
            {
               groupeDomestique.splice(i-1, 1);
            }
        }*/

         for (var i = 0; i < groupeDomestique.length; i++)
        {
            groupeDomestique[i].update(mousePoint);
//            for(var j = 0 ; j < groupeDomestique.length ; j++)
//            {
//                if(groupeDomestique[i].trace01.intersects(groupeDomestique[j].trace01))
//                {
//                    groupeDomestique[i].rebondit();
//                    groupeDomestique[j].rebondit();
//                }
//            }
             if(groupeDomestique[i].trace01 != null)
            {
                if(groupeDomestique[i].trace01.fillColor != null)
                if(groupeDomestique[i].trace01.fillColor.saturation == 0)
                {
                    groupeDomestique[i].destroy();
//                    groupeDOmestique[i]
                    groupeDomestique.splice(i, 1);
                }
            }
        }
                
        if(groupeDomestique.length == 0) {
            //Game over
            menu.trace.visible = true;
            menu.trace.bringToFront();
            texteTutoriel.visible = true;
            texteTutoriel.content = 'Game over :(';
            texteTutoriel.bringToFront();
        }
	}
    
    function TweenVersGauche()
    {
        dropAutorise = false;
        createjs.Tween.get( formeSauvage.trace01.position)
          .to( {  x:largeurCanvas+100}, 500, createjs.Ease.quadOut )  
         
         .call( function() {
       
            TweenVersCentre();
            dropInterdit = true;
      } )  ;
    }
    
     function TweenVersCentre()
    {
        dropAutorise = false;
        renouvelerFormeSauvage();
        formeSauvage.trace01.position.x =  -100 ;
        if(!paused)
        pauseTime = false;
        resetCompteARebours();
        createjs.Tween.get( formeSauvage.trace01.position)
          .to( {  x:  largeurCanvas/2 }, 500, createjs.Ease.quadOut ).call( function() {dropAutorise = true;}) ;
    }
    
     function TweenVersCentreRetardee()
    {
        dropAutorise = false;
        renouvelerFormeSauvage();
        formeSauvage.trace01.position.x =  -100 ;
        if(!paused)
        pauseTime = false;
                resetCompteARebours();
        createjs.Tween.get( formeSauvage.trace01.position)
        .wait (500)
          .to( {  x:  largeurCanvas/2 }, 500, createjs.Ease.quadOut ).call(function(){dropAutorise=true;}) ;
    }
    
    audioInit();
    
    createjs.Ticker.setFPS( 60 );
   // createjs.Ticker.addEventListener( 'tick', update );
}

function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}

function commencerPause() {
    pauseTime = true;
    pauseMovement = true;
    paused = true;
    createjs.Ticker.paused = true; 
}

function finirPause() {
    pauseTime = false;
    pauseMovement = false;
    paused = false;
    createjs.Ticker.paused = false; 
}

function toggleMenu() {
    menu.trace.visible = !menu.trace.visible;
    if(menu.trace.visible)  menu.trace.bringToFront();
    else                    menu.trace.sendToBack();
    texteTutoriel.visible = !texteTutoriel.visible;
    texteTutoriel.bringToFront();
}

function tracerLaPrairie() {
//    var path = new Path.Circle({
//        center: [80, 50],
//        radius: 35
//    });
    var nombreDePoints = 24;
    var path = new Path();
    
    for (var i = 0; i < nombreDePoints; i++) {
        var point = new Point({
            length: prairie.rayon,
            angle: (360 / nombreDePoints) * i
        });
        path.add(point);
    }
    path.closed = true;
    
    // The path is the first child of the group:
    path.strokeColor = 'green';
    path.strokeWidth = 4;
    path.smooth();
    path.position.x = prairie.x;
    path.position.y = prairie.y;
    
    return path;
}