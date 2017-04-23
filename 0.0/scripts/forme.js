
var petiteEchelle = 0.2, grandeEchelle = 2;

function Forme()
{ 
    //Prototype
    this.trace01;
    this.trace01Segments =[];
    this.vitesseX ;
    this.vitesseY;
    this.touchable;
    this.glisse;
    this.colors = ['#140245', '#784537', '#478952'];
    this.figures = ['rond', 'carre', 'triangle'];
    this.paramForme = [];
    this.vieillissement;    //Interval
}

Forme.prototype.create= function()
{ 
	var rect = new Rectangle([0, 0], [25, 25]);
	rect.center = this.mousePoint;
	this.trace01 = new Group();
    
    var figure;
    var _point;
    var _figureName;
    var _figureColor;
    
    this.formeAleatoire();
    
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

Forme.prototype.estSimilaireA = function(cousine) {
    if(this.indexDeCouleur != cousine.indexDeCouleur) return false;
    
    for(var i = 0 ; i < 3 ; i++) {
        if(cousine.paramForme[i][0] == this.paramForme[i][0]) return true;
    }
    return false;
}

Forme.prototype.creerFormeDomestique = function() {
    this.create();
    this.touchable=true;
    this.glisse = false;
    this.domestication();
    
    this.incrementDeVieillessement = Math.random()/100;
    console.info(this.incrementDeVieillessement);
    
    if(vieillesse)
        this.vieillissement = setInterval(desaturation, 100, this.trace01/*.children[i]*/.fillColor, this.incrementDeVieillessement);
}

Forme.prototype.formeAleatoire = function() {
    this.indexDeCouleur = Math.floor(Math.random()*this.colors.length);
    _figureColor =this.colors[this.indexDeCouleur];
    
    this.indexDeForme = [];
    this.paramForme = [];
    this.trace01.removeChildren();
    
    var figures = [];
    
    for( var i = 0; i <3; i++)
    {
        var index = Math.floor(Math.random()*this.figures.length);
        this.indexDeForme.push(index);
        _figureName = this.figures[index];
        
        figure = this.creationTrace(_figureName);
        //figure.fillColor = _figureColor;
        figure.position.y = i*80;
        this.trace01Segments[i]=[];
      /* for(var j = 0; j<figure.segments.length; j++)
                 {
                     point = new Point(figure.segments[j].point);
                this.trace01Segments[i][j]=_point ;
                 }*/
        this.paramForme[i]= [];
        this.paramForme[i].push(_figureName);
        this.paramForme[i].push(_figureColor);
        
        figures.push(figure);
//        figureUnifiee.unite(figure);
        
//        this.trace01.addChild(figure);
    }
    var figureUnifiee;
    figureUnifiee = figures[0].unite(figures[1]);
    figureUnifiee = figureUnifiee.unite(figures[2]);
    
    this.trace01.addChild(figureUnifiee);

    this.trace01.fillColor = _figureColor;
   // this.trace01.fillColor.alpha =.5;
    console.log(this.trace01.fillColor.alpha);
}

Forme.prototype.placerDansLaPrairie= function()
{ 	
	this.trace01.position.x= prairie.x + Math.random()*prairie.rayon*1.8- prairie.rayon*.9;
    this.trace01.position.y=prairie.y + Math.random()*prairie.rayon*1.8- prairie.rayon*.9;
}

Forme.prototype.domestication= function()
{ 	
	this.trace01.scale(petiteEchelle);
}

Forme.prototype.creationTrace = function(figure)
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
}

Forme.prototype.ramenerDansLaPrairie = function() {
//    pauseTime = true;
   // this.trace01.position.x=prairie.x;
   // this.trace01.position.y=prairie.y;
   // this.touchable = false;
     createjs.Tween.get( this.trace01.position)
  .to( { x: prairie.x, y: prairie.y }, 1000, createjs.Ease.quadOut )  
  .call( function(_e) {
        
  } );
//    pauseTime = false;
}

Forme.prototype.estDansLaPrairie = function() {
    var distanceAuCentre = Math.sqrt(Math.pow(this.trace01.position.x-prairie.x, 2) + Math.pow(this.trace01.position.y-prairie.y, 2));
    return distanceAuCentre < prairie.rayon;
}

Forme.prototype.domesticationDeLaSauvage = function() {
    var domestique = new Forme();
    domestique.creerFormeDomestique();
    domestique.paramForme = this.paramForme;
    domestique.trace01.removeChildren();
//    domestique.trace01 = this.trace01;
    
    for(var i = 0 ; i < 3 ; ++i) {
        var figure;
        figure = this.creationTrace(this.paramForme[i][0]);
        //figure.fillColor = this.paramForme[i][1];
        figure.position.y = i*80;
        domestique.trace01.addChild(figure);   
    }
    
    domestique.domestication();

    domestique.trace01.position.x = largeurCanvas/2;
    domestique.trace01.position.y =300;

    domestique.ramenerDansLaPrairie();
//    domestique.trace01.position.x=centerX;
//    domestique.trace01.position.y=centerY;
    
    return domestique;
}

function desaturation(couleur, incrementDeVieillessement) {
    couleur.saturation-=incrementDeVieillessement*vieillissementRapide;
    if(couleur.saturation < 0)
        couleur.saturation = 0;
}

Forme.prototype.update = function(mousePoint)
{	
    if(!pauseMovement)
        for(var i = 0; i<this.trace01.children.length; i++)
        {
            
            //console.log(this.trace01.children[i].fillColor.red);
        }
    
         
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
    if(this.glisse)
   { this.trace01.scale(1/(grandeEchelle));

    this.glisse=false;
   }
}


Forme.prototype.mouseDown = function(mousePoint)
{	
    var hitResult = this.trace01.hitTest(mousePoint, {
	segments: true,
	stroke: true,
	fill: true,
	tolerance: 5
    });
	
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

Forme.prototype.TweenVersCentre = function()
{
    createjs.Tween.get( this.trace01.position)
  .to( { x: 100, y: 300 }, 1000, createjs.Ease.quadOut )  
  .call( function() {
    console.log( 'done!' );
  } );
}

Forme.prototype.destroy = function()
{
    this.trace01.removeChildren();
    this.trace01.remove();
    this.touchable = false;
    clearInterval(this.vieillissement);
}


