/* Copywrite Aron Schatz 2018
 * 
 * 
 */

function $(element)
{
	element = document.getElementById(element);
	return element;
}
var head = document.getElementsByTagName("head")[0];
var scr = document.createElement("script");
scr.setAttribute('src', 'mraid.js');
scr.setAttribute('type', 'text/javascript');
head.appendChild(scr);
window._adclose=false;
// Viewport setup
var meta = document.querySelector("meta[name=viewport]");
if (!meta)
{
  meta = document.createElement("meta");
  meta.name = "viewport";
  meta.content = "width=device-width,user-scalable=no,initial-scale=1,maximum-scale=1";
  head.appendChild(meta);
}
else
{
  meta.content = "width=device-width,user-scalable=no,initial-scale=1,maximum-scale=1";
}
var checkenv=false;
var checkload=false;
var checkready=false;
var checkdefault=false;

function logmessage(message)
{ //Dual logging. It will show in the console and in the ad.
	console.log(message);
	var logdiv = $('logdiv');
	if(logdiv)
	{
		logdiv.insertBefore(document.createElement("br"),logdiv.firstChild);
		logdiv.insertBefore(document.createTextNode(new Date().getTime()+": "+message),logdiv.firstChild);
	}
}


//Check MRAID_ENV
if(window.MRAID_ENV!='undefined')
{
    checkenv=true;
    logmessage("CHECK: Detected MRAID_ENV");
    logmessage("Version: "+window.MRAID_ENV.version+" SDK: "+window.MRAID_ENV.sdk+" SDKv: "+window.MRAID_ENV.sdkVersion);
}



function readycheck()
{
	logmessage('window.onload() triggered.');
	if(mraid.getState() == 'loading') 
	{
                logmessage("CHECK: In loading state.");
		mraid.addEventListener("ready", ready);  
	}
	else
	{
		initad();
	}
	mraid.addEventListener('error', mraiderror);
	mraid.addEventListener('stateChange', statechange);
	mraid.addEventListener('sizeChange', sizechange);
        mraid.addEventListener('audioVolumeChange', volumechange);
	mraid.removeEventListener('stateChange', statechange);
	mraid.addEventListener('stateChange', statechange); //Just to check that removing and adding the same event listener works.
}

function ready()
{
	//Inject a style
	logmessage('Ready event fired.');
	initad();
}

function initad()
{
	//Inject a style
	logmessage('initad() triggered.');
	var gcp = mraid.getCurrentPosition();
        var expp = mraid.getExpandProperties();
        expp.useCustomClose=true;//This should have no effect.
        mraid.setExpandProperties(expp);
	if(mraid.getState()=="default")
        {
         logmessage("CHECK: State is default after ready");   
        }
        window._maxsize=mraid.getMaxSize();
}

function statechange(state)
{
	updateprops("State Change ("+state+", mraid object="+mraid.getState()+")");
}


function orientationchange()
{
	updateprops("Orientation Change");
}

function mraiderror(message,action)
{
	updateprops("MRAID Error: '"+message+"' From: "+action);
}


function expand()
{
    mraid.expand();
}

function unload()
{
    logmessage('Unloading...');
    mraidl.unload();

}

window.addEventListener('orientationchange', orientationchange, false);

if(document.readyState=="complete")
{
	readycheck();
}
else
{
	window.addEventListener('load', readycheck, false); //DOM and MRAID check
}






//Sequenced functions

function expandstatecheck()
{
    //Add an event listener only for state change for this check
    mraid.addEventListener('stateChange',expandstatecheck);
	mraid.expand();
}

function expandstatecheck()
{
 //Check state, check sizing   
    var curpos=mraid.getCurrentPosition();
    if(curpos.width==mraid.getMaxSize().width && curpos.height==mraid.getMaxSize().height && mraid.getState()=='expanded')
    {
        logmessage('CHECK: Variables check upon stateChange after expand');
    }
    else
    {
        logmessage('FAIL: Variables check upon stateChange after expand');
    }
    mraid.removeEventListener('stateChange',expandstatecheck);
    mraid.addEventListener('stateChange',manualclosecheck);
}

function manualclosecheck()
{
 //Check state, check sizing   
    var curpos=mraid.getCurrentPosition();
    if(curpos.width==mraid.getDefaultPosition().width && curpos.height==mraid.getDefaultPosition().height && mraid.getState()=='default')
    {
        logmessage('CHECK: Variables check upon stateChange after manual close');
    }
    else
    {
        logmessage('FAIL: Variables check upon stateChange after manual close');
    }
    mraid.removeEventListener('stateChange',manualclosecheck);
}

function expandsizecheck()
{
    //Add an event listener only for size change for this check
    mraid.addEventListener('sizeChange',expandsizecheck);
	mraid.expand();
}

function expandsizecheck()
{
 //Check state, check sizing   
    var curpos=mraid.getCurrentPosition();
    if(curpos.width==mraid.getMaxSize().width && curpos.height==mraid.getMaxSize().height && mraid.getState()=='expanded')
    {
        logmessage('CHECK: Variables check upon sizeChange after expand');
    }
    else
    {
        logmessage('FAIL: Variables check upon sizeChange after expand');
    }
    mraid.removeEventListener('sizeChange',expandsizecheck);
    window._adclose=true;
}

function expandsizeclose()
{
    mraid.addEventListener('sizeChange',adclosesizecheck);   
    if(window._adclose)
    {
        mraid.close();
    }

}

function adclosesizecheck()
{
  //Check state, check sizing   
    var curpos=mraid.getCurrentPosition();
    if(curpos.width==mraid.getDefaultPosition().width && curpos.height==mraid.getDefaultPosition().height && mraid.getState()=='default')
    {
        logmessage('CHECK: Variables check upon sizeChange after ad close');
    }
    else
    {
        logmessage('FAIL: Variables check upon sizeChange after ad close');
    }
    mraid.removeEventListener('sizeChange',adclosesizecheck);   
}
