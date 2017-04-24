var /*pause = false, */pauseTime = false, pauseMovement = false, paused = false, gameOver = false;
var nombreDeFormesDomestiquesInitiales = 5;
var vieillesse = true, vieillissementRapide = 1;
var formesMulticolores = true, rareteDeMulticolore = 6; //Plus rareteDeMulticolore est élevée, moins y en a (à 10, 1 forme sur 10 sera multicolore)
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
            figure1 = new Path.Rectangle(new Point(0, 0), new Point(5, hauteur));
            figure2 = new Path.Rectangle(new Point(0, 0), new Point(5, hauteur));
            figure2.position.x = 15;

            bg.fillColor = "white"; 
            bg.fillColor.alpha = 0.01;
            figure1.fillColor = "white";
            figure2.fillColor = "white";

            this.trace.addChild(bg);
            this.trace.addChild(figure1);
            this.trace.addChild(figure2);
//            this.trace.addChild(dessinerPlay());
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
    
    boutonDePause = new Bouton(320, 30, 20, 20);
    menu = new Bouton(0, 0, 250, 500);
    menu.trace.visible = false;
    menu.traceDeRectangle(175, 300, 275, 500);
    menu.trace.fillColor="#034049";
    var myPath = new Path();
myPath.strokeColor = 'white';
    myPath.strokeWeight= 2;
myPath.add(new Point(25, 300));
myPath.add(new Point(325, 300));
    
    texteTutoriel = new paper.PointText(new paper.Point(80, 180));
//    texteTutoriel = new paper.PointText();
    texteTutoriel.fillColor = '#0b91a5';
    texteTutoriel.visible = false;
    texteTutoriel.fontSize = 15;
    texteTutoriel.position.x =180;

//    console.log(texteTutoriel.bounds);
//    texteTutoriel.bounds = new paper. Rectangle(80, 180, 100, 200);
//    console.log(texteTutoriel.bounds);
texteTutoriel.justification = 'center';
    texteTutoriel.content  = "Forme Sauvage\n Wild Form\n\n You need to capture the wild forms \nappearing in the top half of the screen,\nusing a matching form among\nthe domesticated ones you own\n(bottom half).\nForms match when they share\nan identically-colored shape\nat the same position.";
    menu.trace.addChild(texteTutoriel);
    
    
    texteScore = new paper.PointText(new paper.Point(20, 40));
    texteScore.fillColor = 'white';
    texteScore.content  = "0";
    texteScore.fontSize=30;
    
   //traceDePrairie = tracerLaPrairie();
    
    function renouvelerFormeSauvage() {
//        formeSauvage.destroy();
        formeSauvage.formeAleatoire();
        formeSauvage.trace01.position.x =largeurCanvas/2;
        formeSauvage.trace01.position.y =180;
        textCompteARebours.fillColor = formeSauvage.trace01.children[1].fillColor;
        
        //TweenVersGauche();
    }
    
    function changeCompteARebours() { 
        if(!pauseTime) {
            compte -= 100;
    //            textCompteARebours.content = (5-Math.floor(compte/10))+" : "+(9-compte%10); 
            textCompteARebours.content = Math.floor(compte/1000) + "." + Math.floor(compte%1000)/100;
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
    
    

    
    var formeSauvage = Forme();
    formeSauvage = new Forme();
	formeSauvage.create();
    formeSauvage.touchable=false;
    formeSauvage.trace01.position.x =largeurCanvas/2;
    formeSauvage.trace01.position.y =180;
    
    textCompteARebours = new paper.PointText(new paper.Point(150,40));
//    console.info(compte);
//    console.info(textCompteARebours.hasFill());
    textCompteARebours.fillColor = formeSauvage.trace01.children[1].fillColor;
    textCompteARebours.content = '0';
    textCompteARebours.fontSize =30;
    
    var groupeDomestique = [];
    
    for (var i = 0; i < nombreDeFormesDomestiquesInitiales; i++)
    {
        var formeDomestique = new Forme();
        formeDomestique.creerFormeDomestique(i);
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
//        mouseDownTemps = date.getTime();
        
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
        } else {
             for (var i = groupeDomestique.length-1; i>=0; i--) {
                if(groupeDomestique[i].mouseDown(event.point))
                    groupeDomestique[i].incrementDeVieillessement.valeur *= -1;

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
	}
    
     tool.onMouseUp = function(event)
     {
//         deltaTemps = mouseDownTemps - date.getTime();
         

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
                    feedbackAudioPositif();
                    console.log("bon drop");
                    groupeDomestique.push(formeSauvage.domesticationDeLaSauvage());
                    if(!formeGlisse.estDansLaPrairie()) formeGlisse.ramenerDansLaPrairie();
                    formeGlisse.mouseUp(event.point);
                    
                    for(var i = 1 ; i < formeGlisse.trace01.children.length ; i++) {
                        formeGlisse.trace01.children[i].fillColor.alpha = 1;
                    }
                    
                    score += scoreLocal;
                    texteScore.content = score;
                    console.log(score);
                } else {
                    feedbackAudioNegatif();

                    console.log("mauvais drop");
                    //kill formeglisse
                    var index = groupeDomestique.indexOf(formeGlisse);
                    if(index >= 0) {
                        groupeDomestique[index].destroy();
                        groupeDomestique.splice(index, 1);
                    }
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
         formeGlisse =null;
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
             if(groupeDomestique[i].trace01 != null)
            {
                if(groupeDomestique[i].trace01.children[1].fillColor != null)
                if(groupeDomestique[i].trace01.children[1].fillColor.alpha == 0)
                {
                    groupeDomestique[i].destroy();
//                    groupeDOmestique[i]
                    groupeDomestique.splice(i, 1);
                }
            }
        }
        
        if(groupeDomestique.length == 0) {
            //Game over
            gameOver = true;
            menu.trace.visible = true;
            menu.trace.bringToFront();
            texteTutoriel.visible = true;
            texteTutoriel.content = 'Game over :(';
            texteTutoriel.bringToFront();
            commencerPause();
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
      } );
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
    
//    boutonDePause.trace.addChild(dessinerPlay());
}

function finirPause() {
    pauseTime = false;
    pauseMovement = false;
    paused = false;
    createjs.Ticker.paused = false;
    
    if(gameOver)
        {restart();}
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

    
    
function restart(){
    
    gameOver = false;
    paused = false;
    score =0;
    texteScore.content  = score;
    groupeDomestique = null;
    groupeDomestique = [];
   
    for (var i = 0; i < nombreDeFormesDomestiquesInitiales; i++)
    {
        var formeDomestique = new Forme();
        formeDomestique.creerFormeDomestique(i);
        formeDomestique.placerDansLaPrairie();
        groupeDomestique.push(formeDomestique);
       
    }
    
  resetCompteARebours()
     formeSauvage.trace01.position.x = -100;        
}
    
    audioInit();
    createjs.Ticker.setFPS( 60 );

    
    //Pause au démarrage pause on start
    menu.trace.visible = true;
    menu.trace.bringToFront();
    texteTutoriel.visible = true;
    texteTutoriel.bringToFront();
    commencerPause();    
   // createjs.Ticker.addEventListener( 'tick', update );
}


