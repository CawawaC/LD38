var pause = false;
var nombreDeFormesDomestiquesInitiales = 10;

paper.install(window);
window.onload = function ()
{
	// setup paper JS
	paper.setup('gameCanvas');
	var tool = new Tool();

	// variables et objets
	var mousePoint = view.center;
    var timerCompteARebours = setInterval(changeCompteARebours, 100);
<<<<<<< HEAD
    var compte = 4000;
    
=======
    var compte =0;
    var formeGlisse;
>>>>>>> nat
    function changeCompteARebours() { 
        if(!pause) {
            compte -= 100;
//            textCompteARebours.content = (5-Math.floor(compte/10))+" : "+(9-compte%10); 
            textCompteARebours.content = Math.floor(compte/1000) + ":" + Math.floor(compte%1000)/100;
            if(compte == 0)
            {
                renouvelerFormeSauvage();
                resetCompteARebours();
            }
        }
    }
    
    function renouvelerFormeSauvage() {
        formeSauvage.formeAleatoire();
        formeSauvage.trace01.position.x =300;
        formeSauvage.trace01.position.y =300;
    }
    
    function resetCompteARebours() {
        clearInterval(timerCompteARebours);
        timerCompteARebours = setInterval(changeCompteARebours, 100);
        compte = 4000;
    }
    
    var textCompteARebours = new paper.PointText(new paper.Point(100,100));
//    console.info(compte);
//    console.info(textCompteARebours.hasFill());
    textCompteARebours.fillColor = 'white';
    textCompteARebours.content = '0';

    
    var formeSauvage = Forme();
    formeSauvage = new Forme();
	formeSauvage.create();
    formeSauvage.touchable=false;
    formeSauvage.trace01.position.x =300;
    formeSauvage.trace01.position.y =300;
    
    var groupeDomestique = [];
    
    for (var i = 0; i< nombreDeFormesDomestiquesInitiales; i++)
    {
        var formeDomestique = new Forme();
        formeDomestique.creerFormeDomestique();
        groupeDomestique.push(formeDomestique);
    }
    
	// paper JS event mouse
	tool.onMouseMove = function(event)
	{
		mousePoint = event.point;
	}
    
    tool.onMouseDown = function(event)
	{
        if(formeSauvage.mouseDown(event.point)) {
            var f = formeSauvage;
            jouerUnSonDeForme([
                [f.indexDeForme[2], 2, f.indexDeCouleur],
                [f.indexDeForme[1], 1, f.indexDeCouleur],
                [f.indexDeForme[0], 0, f.indexDeCouleur]
            ]);
        }
        
         for (var i = 0; i<groupeDomestique.length; i++)
        {
            groupeDomestique[i].mouseDown(event.point);
            
            if( groupeDomestique[i].glisse)
            {
<<<<<<< HEAD
                groupeDomestique[i].trace01.bringToFront();
                var f = groupeDomestique[i];
                jouerUnSonDeForme([
                    [f.indexDeForme[2], 2, f.indexDeCouleur],
                    [f.indexDeForme[1], 1, f.indexDeCouleur],
                    [f.indexDeForme[0], 0, f.indexDeCouleur]
                ]);
=======
                 groupeDomestique[i].trace01.bringToFront();
                formeGlisse = groupeDomestique[i];
>>>>>>> nat
                break;
            } 
        }
	}
    
     tool.onMouseUp = function(event)
	{
         
        /*var hitResult = formeDomestique.trace01.intersects(formeSauvage.trace01);

        if (hitResult)
        {
           console.log('collide');
        }
         */
         var hitResult ;
<<<<<<< HEAD
         for (var i = 0; i<groupeDomestique.length; i++)
        {
            
            
            hitResult = groupeDomestique[i].trace01.intersects(formeSauvage.trace01);

        if (hitResult)
        {
          var dropValide = true;
            for(var j =0; j<3; j++)
            {
                if(groupeDomestique[i].paramForme[0][1] ==formeSauvage.paramForme[0][1])
               {
                     console.log('comparaison validée');
               }
            }
            
            if(dropValide) {
                groupeDomestique.push(clone(formeSauvage));
            }
        }
            groupeDomestique[i].mouseUp(event.point);
        }
=======
        // for (var i = 0; i<groupeDomestique.length; i++)
       // {         
             
           // hitResult = groupeDomestique[i].trace01.intersects(formeSauvage.trace01);
            hitResult = formeSauvage.trace01.hitTest(event.point, {
	segments: true,
	stroke: true,
	fill: true,
	tolerance: 5
});
            if (hitResult)
            {
                 console.log('collide'); 
                for(var j =0; j<3; j++)
                {
                    if(formeGlisse.paramForme[0][1] ==formeSauvage.paramForme[0][1])
                   {
                         console.log('collide'); 
                       //break;
                   }
                }
            }
            formeGlisse.mouseUp(event.point);
         formeGlisse =null;
       // }
>>>>>>> nat
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
<<<<<<< HEAD
//         console.log(groupeDomestique.length);
=======
         
>>>>>>> nat
         for (var i = 0; i<groupeDomestique.length; i++)
        {
            groupeDomestique[i].update(mousePoint);
            for(var j = 0 ; j < groupeDomestique.length ; j++)
            {
                if(groupeDomestique[i].trace01.intersects(groupeDomestique[j].trace01))
                {
                    groupeDomestique[i].rebondit();
                    groupeDomestique[j].rebondit();
                }
            }
             if( groupeDomestique[i].trace01.children.length>0)
            {
                if( groupeDomestique[i].trace01.children[0].fillColor.saturation == 0)
                {
                    groupeDomestique[i].destroy();
                }
            }
        }
                
        
	}
    
    audioInit();
}

function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}