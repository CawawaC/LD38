
var petiteEchelle = 0.25, grandeEchelle = 3;

function Forme()
{ 
    //Prototype
    this.trace01;
    this.trace01Segments =[];
    this.vitesseX ;
    this.vitesseY;
    this.touchable;
    this.glisse;
    this.colors = ['#5FC5ED', '#F7C660', '#E38C5A'];
    this.figures = ['rond', 'carre', 'triangle'];
    this.formesComposantes = [];
    this.vieillissement;    //Interval
    this.incrementDeVieillessement = {valeur:0};    //Gros fake. Modifier la variable valeur !
}

Forme.prototype.create= function(couleur = -1)
{ 
	var rect = new Rectangle([0, 0], [25, 25]);
	rect.center = this.mousePoint;
	this.trace01 = new Path();
    
    var figure;
    var _point;
    var _figureName;
    var _figureColor;
    
    this.formeAleatoire(couleur);
    
    //spawn
    //this.ramenerDansLaPrairie();
//    this.trace01.position.x=centerX;
//    this.trace01.position.y=centerY;
    
    this.vitesseAleatoire();
    
    this.touchable = true;
    this.glisse = true;
}

Forme.prototype.meurs = function() {
    this.trace01.remove();
}

Forme.prototype.couleurEn = function(i) {
    if(this.multicolore) {
        return this.indexDeMulticolore[i];
    } else {
        return this.indexDeCouleur;
    }
}

Forme.prototype.estSimilaireA = function(cousine) {
    if(!formesMulticolores)
        if(this.indexDeCouleur != cousine.indexDeCouleur) return 0;
    
    scoreLocal = 0;
    for(var i = 0 ; i < 3 ; i++) {
        if(formesMulticolores) {
            console.log("comparaison de formes multi");
            if(cousine.formesComposantes[i] == this.formesComposantes[i] &&
              cousine.couleurEn(i) == this.couleurEn(i)) scoreLocal++;
        } else {
            if(cousine.formesComposantes[i] == this.formesComposantes[i]) scoreLocal++;
        }
    }
    if(scoreLocal == 3) scoreLocal = 5;
    return scoreLocal;
}

Forme.prototype.creerFormeDomestique = function(couleur = -1, creerTimer = true) {
    this.create(couleur);
    this.touchable=true;
    this.glisse = false;
    this.domestication();
    
    this.incrementDeVieillessement.valeur = Math.random()/100+0.001;
//    console.info(this.incrementDeVieillessement.valeur);
    

   
    if(vieillesse)
       { this.vieillissement = setInterval(desaturation, 100, this.trace01, this.incrementDeVieillessement);
     //  console.log("programmation du vieillissement");
       }
    
    return this.indexDeCouleur;

}

Forme.prototype.formeAleatoire = function(couleur = -1) {
    this.multicolore = false;
    
    this.indexDeMulticolore = [];
    
    var creerUneMulticolore = 0;
    if(formesMulticolores) creerUneMulticolore = Math.floor(Math.random() * rareteDeMulticolore);  //Probabilité d'une multicolore
    console.log(creerUneMulticolore);
    if(creerUneMulticolore == 1) this.multicolore = true;
    
    if(couleur >= 0 && couleur < 3) {
//        console.info()
        _figureColor = colors[couleur];
        this.indexDeCouleur = couleur;
//        console.info(this.fillColor);
    } else if (!this.multicolore) {
        this.indexDeCouleur = Math.floor(Math.random()*this.colors.length);
        _figureColor = this.colors[this.indexDeCouleur];
    }
    
    this.indexDeForme = [];
    this.formesComposantes = [];
    this.trace01 = new Group();
    
    var figuresTemp = [];
    var figureUnifiee = new Path();
    
    //Ombre
    this.trace01.addChild(this.creationPath(45,4,0,220));

    //Figures
    for( var i = 0; i <3; i++)
    {
//        var figure = new Path();
        
        var index = Math.floor(Math.random()*this.figures.length);
        this.indexDeForme.push(index);
        _figureName = this.figures[index];
        
        if(this.multicolore) {
            var coul = Math.floor(Math.random()*this.colors.length);
            this.indexDeMulticolore.push(coul);
            var _couleurLocale = this.colors[coul]; 
        } else {
            _couleurLocale = _figureColor;
        }
       // figure = this.creationTrace(_figureName);
        switch(i)
            {
            case 0:
                figure = this.creationTraceTete(_figureName);
                break;
                  case 1:
                figure = this.creationTraceCorps(_figureName);
                break;
                  case 2:
                figure = this.creationTracePieds(_figureName);
                break;
        }
//        figure.fillColor = _figureColor;
        figure.position.y = i*80;
//        this.trace01Segments[i]=[];
      /* for(var j = 0; j<figure.segments.length; j++)
                 {
                     point = new Point(figure.segments[j].point);
                this.trace01Segments[i][j]=_point ;
                 }*/
        this.formesComposantes[i] = index;
        
        /*if(formesMulticolores) */figure.fillColor = _couleurLocale;
//        else this.trace01.fillColor = _figureColor;
//        figuresTemp.push(figure);
        
//        figureUnifiee.unite(figure);
        this.trace01.addChild(figure);
        
//        figure.remove();
    }
//    var figureUnifiee;
//    figureUnifiee = figuresTemp[0].unite(figuresTemp[1]);
//    figureUnifiee = figureUnifiee.unite(figuresTemp[2]);
//        
//    figuresTemp[0].remove();
//    figuresTemp[1].remove();
//    figuresTemp[2].remove();

//    this.trace01.addChild(figureUnifiee);

    this.trace01.scale(.7);
    //    this.trace01.children[1].fillColor =_figureColor;
    this.trace01.children[0].fillColor = "#000000";
    this.trace01.children[0].fillColor.alpha =.3;

   // this.trace01.fillColor.alpha =.5;
}

Forme.prototype.placerDansLaPrairie= function()
{ 	
	this.trace01.position.x= prairie.x + Math.random()*prairie.rayon*1.8- prairie.rayon*.9;
    this.trace01.position.y=prairie.y + Math.random()*prairie.rayon*1.8- prairie.rayon*.9;
}

Forme.prototype.domestication= function()
{ 	
	this.trace01.scale(1/grandeEchelle);
}

/*Forme.prototype.creationTrace = function(figure)
{
	var path = new Path();
    var rayon = 50;
    var points ;
    switch(figure)
    {
           case"rond":
            points =12;
            break;
            case"carre":
            points =4;
            break;
        case "triangle":
            points=3;
            break;
    }
	path.closed = true;
	for (var i = 0; i < points; i++) {
		var delta = new Point({
			length: rayon,
			angle: (360 / points) * i
		});
		path.add(delta);
	}
    
	return path;
}*/

Forme.prototype.ramenerDansLaPrairie = function() {
//    pauseTime = true;
   // this.trace01.position.x=prairie.x;
   // this.trace01.position.y=prairie.y;
   // this.touchable = false;
     createjs.Tween.get( this.trace01.position)
  .to( { x: prairie.x, y: prairie.y }, 1000, createjs.Ease.quadOut ) ;
     createjs.Tween.get( this.trace01)
  .to( {scal:1/grandeEchelle }, 1000, createjs.Ease.quadOut ) ;
    
    
//    pauseTime = false;
}

Forme.prototype.estDansLaPrairie = function() {
    var distanceAuCentre = Math.sqrt(Math.pow(this.trace01.position.x-prairie.x, 2) + Math.pow(this.trace01.position.y-prairie.y, 2));
    return distanceAuCentre < prairie.rayon;
}

Forme.prototype.domesticationDeLaSauvage = function() {
    var domestique = new Forme();
    domestique.creerFormeDomestique(-1, false);
    
    //Copier caractéristiques
    domestique.formesComposantes = this.formesComposantes;
    domestique.indexDeCouleur = this.indexDeCouleur;
    
    domestique.trace01.remove();
    domestique.trace01 = this.trace01;
    
    if(vieillesse)
        domestique.vieillissement = setInterval(
            desaturation, 
            100, 
            domestique.trace01, 
            domestique.incrementDeVieillessement);
    
//    domestique.trace01 = this.trace01;
    
//    for(var i = 0 ; i < 3 ; ++i) {
//        var figure;
//        figure = this.creationTrace(this.formesComposantes[i][0]);
//        figure.fillColor = this.formesComposantes[i][1];
//        figure.position.y = i*80;
//        domestique.trace01.addChild(figure);   
//    }
    
    domestique.domestication();
//    domestique.trace01.position.x = largeurCanvas/2;
//    domestique.trace01.position.y =300;
    domestique.ramenerDansLaPrairie();
//    domestique.trace01.position.x=centerX;
//    domestique.trace01.position.y=centerY;
    
    return domestique;
}

function desaturation(fig, increment) {
//    console.log(increment.valeur);
//    if(!paused) {
//        couleur.saturation-=incrementDeVieillessement*vieillissementRapide;
//        if(couleur.saturation < 0)
//            couleur.saturation = 0;
    if(!paused) {
//        if(vieillissementInverse)
//            couleur.alpha += incrementDeVieillessement*vieillissementRapide;
//        else
        
//        if(formesMulticolores)
            for(var i = 1 ; i < fig.children.length ; i++) {
    //            console.log(fig.children[i]);
                fig.children[i].fillColor.alpha -= increment.valeur*vieillissementRapide;
                if(fig.children[i].fillColor.alpha < 0)
                    fig.children[i].fillColor.alpha = 0;
            }
//        else {
//            console.log(fig.fillColor);
//            fig.fillColor.alpha -= increment.valeur*vieillissementRapide;
//            if(fig.fillColor.alpha < 0)
//                fig.fillColor.alpha = 0;
//        }
    }
}

Forme.prototype.update = function(mousePoint)
{	     
    if(this.glisse && this.touchable)
    {
        this.trace01.position.x =(mousePoint.x);
        this.trace01.position.y =(mousePoint.y);
        
     /*  for (var i = 0; i<4; i++)
            {
             for(var j = 0; j<this.trace01.children[i].segments.length; j++)
                 {
                this.trace01.children[i].segments[j].point = this.trace01Segments[i][j];
                     this.trace01.children[i].segments[j].point.x+= Math.random()*2-1;
                      this.trace01.children[i].segments[j].point.y+= Math.random()*2-1;
                    
                 }
            }*/
     
 
    } else if(!this.glisse && this.touchable) {
        if(!pauseMovement) {
            var newX = this.trace01.position.x + this.vitesseX;
            var newY = this.trace01.position.y + this.vitesseY;
            var distanceAuCentre = Math.sqrt(Math.pow(newX-prairie.x, 2) + Math.pow(newY-prairie.y, 2));

            if(distanceAuCentre >= prairie.rayon) {
                this.vitesseX *= -1;
                this.vitesseY *= -1;
                newX = this.trace01.position.x + this.vitesseX;
                newY = this.trace01.position.y + this.vitesseY;
            }
            this.trace01.position.x = newX;
            this.trace01.position.y = newY;
        }
    }
}

Forme.prototype.vitesseAleatoire = function() {
    this.vitesseX = (Math.random()*2-1)*0.6;
    this.vitesseY = (Math.random()*2-1)*0.6;
}

//Forme.prototype.rebondit = function() {
//    var tempX = this.vitesseX;
//    this.vitesseX = this.vitesseY;
//    this.vitesseY = tempX;
//}

Forme.prototype.mouseUp = function(mousePoint)
{	
    if(this.glisse) { 
        this.trace01.scale(1/(grandeEchelle));
        this.glisse=false;
    }
    
    //Inversion du vieillissement (à nouveau normal)
//    this.vieillissementInverse = false;
    this.incrementDeVieillessement.valeur *= -1;
}


Forme.prototype.mouseDown = function(mousePoint)
{	
    var hitResult = this.trace01.hitTest(mousePoint, {
        segments: true,
        stroke: true,
        fill: true,
        tolerance: 5
    });
    
    //Inversion du vieillissement (rajeunit pendent qu'elle est saisie)
//    this.vieillissementInverse = true;

	
	if (hitResult)
    {
        if(this.touchable) {
            this.glisse = true;
            this.trace01.scale(grandeEchelle);
        } /*else  {    //C'est la forme sauvage
            
        }*/
    }
    return hitResult;
}
Forme.prototype.creationTraceTete = function(figure)
{
	var path = new Path();
    var rayon = 50;
    var points ;
    switch(figure)
    {
            case"rond":            
			path=this.creationPath(45,12,0,0);
			path = path.unite(this.creationPath(25,12,0,-40));
			path = path.subtract(this.creationPath(25,3,0,-6,270));
			path = path.unite(this.creationPath(10,3,0,-3,270));
            break;	
            case"carre":
            path=this.creationPath(48,4,0,0);
			path = path.unite(this.creationPath(25,3,0,-40,270));
			 path = path.subtract(this.creationPath(20,12,0,0));
			path = path.unite(this.creationPath(10,12,0,0));
            break;
        case "triangle":
          path=this.creationPath(55,3,0,0,270);
		  path = path.subtract(this.creationPath(20,4,0,6));
			path = path.unite(this.creationPath(10,4,0,6));
            break;
    } 
	path.position.y=-80;	
	return path;
}

Forme.prototype.creationTraceCorps = function(figure)
{
	var path = new Path();
	var path02 = new Path();
    var rayon = 50;
    var points ;
    switch(figure)	
    {
        case"rond":            
			path=this.creationPath(50,12,0,0);
			path = path.unite(this.creationPath(15,4,-70,0));
			path = path.unite(this.creationPath(15,4,70,0));			
			path = path.subtract(this.creationPath(17,12,0,0));
			path = path.unite(this.creationPath(12,12,00,0));
            break;
        case"carre":
            path=this.creationPath(55,4,0,0);	
			path = path.unite(this.creationPath(15,3,-50,20,15));
			path = path.unite(this.creationPath(15,3,50,20,45));
			path = path.subtract(this.creationPath(7,4,0,0));
            break;
        case "triangle":
          path=this.creationPath(60,3,0,0,270);
		  path = path.unite(this.creationPath(20,12,0,-27));
		  path = path.subtract(this.creationPath(12,3,0,8,270));
            break;
    }    
	return path;
}

Forme.prototype.creationTracePieds = function(figure)
{
	var path = new Path();
    var rayon = 50;
    var points ;
    switch(figure)
    {
            case"rond":            
			path=this.creationPath(35,12);
			path = path.unite(this.creationPath(15,12,0,55));
            break;
            case"carre":
            path=this.creationPath(50,4,0,0);
			path = path.subtract(this.creationPath(15,4,0,0));
			path = path.unite(this.creationPath(25,4,0,45));
			
            break;
        case "triangle":
			path=this.creationPath(50,3,0,0,270);
			path =  path.unite(this.creationPath(20,3,0,45,270));
			path = path.unite(this.creationPath(10,3,0,70,270));
            break;
    }   
	path.position.y=80;		
	return path;
}
Forme.prototype.creationPath = function(rayon,sommets,x=0,y=0,angle=0)
{
	var path = new Path();
	path.closed = true;
	for (var i = 0; i < sommets; i++) {
		var delta = new Point({
			length: rayon,
			angle: (360 / sommets) * i
		});
		path.add(delta);
	}
	path.rotate(angle);
    path.position.x=x;
	path.position.y=y;
	return path;
}
Forme.prototype.TweenVersCentre = function()
{
    createjs.Tween.get( this.trace01.position)
  .to( { x: 100, y: 300 }, 1000, createjs.Ease.quadOut );
}

Forme.prototype.TweenDezoom = function()
{
    createjs.Tween.get( this.trace01)
  .to( { scale : 1/grandeEchelle}, 1000, createjs.Ease.quadOut );
}

Forme.prototype.destroy = function()
{
    this.trace01.removeChildren();
    this.trace01.remove();
    this.touchable = false;
    clearInterval(this.vieillissement);
     this.incrementDeVieillessement = null;
}


