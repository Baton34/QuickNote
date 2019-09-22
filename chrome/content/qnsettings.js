//const Ci = Components.interfaces, Cu = Components.utils, Cc = Components.classes;
//Cu.import("resource://gre/modules/Console.jsm");

var nsPreferences = {
  get mPrefService()
    {
      return Components.classes["@mozilla.org/preferences-service;1"]
                       .getService(Components.interfaces.nsIPrefBranch);
    },
/*
  setBoolPref: function (aPrefName, aPrefValue)
    {
      try 
        {
          this.mPrefService.setBoolPref(aPrefName, aPrefValue);
        }
      catch(e)
        {
        }
    },
  
  getBoolPref: function (aPrefName, aDefVal)
    {
      try
        {
          return this.mPrefService.getBoolPref(aPrefName);
        }
      catch(e)
        {
          return aDefVal != undefined ? aDefVal : null;
        }
      return null;        // quiet warnings
    },
 */ 
  setUnicharPref: function (aPrefName, aPrefValue)
    {
      try
        {
          var str = Components.classes["@mozilla.org/supports-string;1"]
                              .createInstance(Components.interfaces.nsISupportsString);
          str.data = aPrefValue;
          this.mPrefService.setComplexValue(aPrefName,
                                            Components.interfaces.nsISupportsString, str);
        }
      catch(e)
        {
        }
    },
/*  
  copyUnicharPref: function (aPrefName, aDefVal)
    {
      try
        {
          return this.mPrefService.getComplexValue(aPrefName,
                                                   Components.interfaces.nsISupportsString).data;
        }
      catch(e)
        {
          return aDefVal != undefined ? aDefVal : null;
        }
      return null;        // quiet warnings
    },
    
  setIntPref: function (aPrefName, aPrefValue)
    {
      try
        {
          this.mPrefService.setIntPref(aPrefName, aPrefValue);
        }
      catch(e)
        {
        }
    },
  
  getIntPref: function (aPrefName, aDefVal)
    {
      try
        {
          return this.mPrefService.getIntPref(aPrefName);
        }
      catch(e)
        {
          return aDefVal != undefined ? aDefVal : null;
        }
      return null;        // quiet warnings
    },
*/
  getLocalizedUnicharPref: function (aPrefName, aDefVal)
    {
      try
        {
          return this.mPrefService.getComplexValue(aPrefName,
                                                   Components.interfaces.nsIPrefLocalizedString).data;
        }
      catch(e)
        {
          return aDefVal != undefined ? aDefVal : null;
        }
      return null;        // quiet warnings
    }
}

var teo_qn = {

	prompts : Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
											.getService(Components.interfaces.nsIPromptService),

	appInfo : Components.classes["@mozilla.org/xre/app-info;1"]
											.getService(Components.interfaces.nsIXULAppInfo),

	versionChecker : Components.classes["@mozilla.org/xpcom/version-comparator;1"]
														 .getService(Components.interfaces.nsIVersionComparator),
	loadQNSettings: function()
	{
		var numberOfTabs = QN_globalvar.qnprefs.getIntPref("numtabs");
		var arr=["Two","Three","Four","Five","Six"];
		if ([1,2,3,4,5,6].indexOf(numberOfTabs) == -1) {
			numberOfTabs = 2;
			QN_globalvar.qnprefs.setIntPref("numtabs", numberOfTabs);
		}
	
		document.getElementById('numtab-radiogroup').value = numberOfTabs;
		var nt=numberOfTabs-2;
		for(var i=0;i<nt;i++){var j=i+2
			document.getElementById('QNTab'+arr[i]+'FileB').collapsed = false
			document.getElementById('choose-tab'+j).disabled = false;
			document.getElementById('tabadvanced'+j).collapsed = false;
		}
		// ## Get Font Size, Colour and Type
		var i;
		var numerals = ["", "One", "Two", "Three", "Four","Five","Six"]; // a quick hack. We need to change the |id|s during settings rewrite.
		for(i=1; i<=6; i++) {
			document.getElementById('QNTab'+numerals[i]+'FontColor').color = QN_globalvar.qnprefs.getCharPref("fontcolor"+i);
			document.getElementById('QNTab'+numerals[i]+'Fontsizetb').value = QN_globalvar.qnprefs.getIntPref("fontsize"+i);
			document.getElementById('QNTab'+numerals[i]+'FontName').value = QN_globalvar.qnprefs.getCharPref("fontname"+i);
			document.getElementById('UserStyleDefTab'+i).value = QN_globalvar.qnprefs.getCharPref("userstyle"+i);
			document.getElementById('QNTab'+numerals[i]+'BGColor').color = QN_globalvar.qnprefs.getCharPref("bgcolortab"+i);

			// ## User Files Paths	##
			document.getElementById('QNTab'+numerals[i]+'File').value = nsPreferences.getLocalizedUnicharPref("extensions.quicknote.tab"+i+"path");
		}
		// ## Sets the "Send To.." options! And language support options. ##
		var sendTo = QN_globalvar.qnprefs.getIntPref("totabint");
		if( (sendTo < 1) || (sendTo>6) ) {
			sendTo = 1;
			QN_globalvar.qnprefs.setIntPref('totabint', 1);
		}
		document.getElementById("totabint-radiogroup").value = sendTo;

		// ##AutoSave Prefs ##
		var autosave = QN_globalvar.qnprefs.getIntPref("autosave");
		if (autosave == 0)
		{
			document.getElementById('AutoSave-radiogroup').value = 0;
			document.getElementById('xthCharTB').collapsed = true;
			document.getElementById('xthCharLabel').collapsed = true;
		}else if (autosave == -1)
		{
			document.getElementById('AutoSave-radiogroup').value = -1;
			document.getElementById('xthCharTB').collapsed = true;
			document.getElementById('xthCharLabel').collapsed = true;
		}else if (autosave > 0){
			document.getElementById('AutoSave-radiogroup').value = 10;
			document.getElementById('xthCharTB').value = autosave;
		}
		if(this.versionChecker.compare(this.appInfo.version, "29") >= 0){document.getElementById("showinFirefoxButton").collapsed = true;}
		if(this.versionChecker.compare(this.appInfo.version, "29") >= 0){document.getElementById("showinAddonsBar").collapsed = true;}
    if(navigator.userAgent.search(/SeaMonkey/gi) >= 0) {
			document.getElementById("fbtbfunc-s").collapsed = true;
			document.getElementById("showinFirefoxButton").hidden = true;
		switch(openMethod) {
			case 1:
				document.getElementById('fbtbfunc-f').setAttribute('selected', true);
				document.getElementById('fbtbfunc-t').setAttribute('selected', false);
				break;
			case 2:
				document.getElementById('fbtbfunc-f').setAttribute('selected', false);
				document.getElementById('fbtbfunc-t').setAttribute('selected', true);
				break;
			}
		} 
		if(navigator.userAgent.search(/Thunderbird/gi) >= 0) {
			document.getElementById("fbtbfunc-s").collapsed = true;
			document.getElementById("showinFirefoxButton").hidden = true;
			document.getElementById("showinAddonsBar").hidden = false;
			document.getElementById('fbtbfunc-f').setAttribute('selected', true);
			document.getElementById('fbtbfunc-t').setAttribute('selected', false);
		}	
		if (navigator.userAgent.search(/Thunderbird/gi) > 0&&navigator.userAgent.search(/6./gi)>0 ){
		var openMethod = QN_globalvar.qnprefs.getIntPref("openqn");
			document.getElementById("fbtbfunc-s").collapsed = true;
			document.getElementById("showinFirefoxButton").hidden = true;
		switch(openMethod) {
			case 1:
				document.getElementById('fbtbfunc-f').setAttribute('selected', true);
				document.getElementById('fbtbfunc-t').setAttribute('selected', false);
				break;
			case 2:
				document.getElementById('fbtbfunc-f').setAttribute('selected', false);
				document.getElementById('fbtbfunc-t').setAttribute('selected', true);
				break;
			}
		}
	else {
		if (navigator.userAgent.search(/Firefox/gi) == -1 )
		var openMethod = QN_globalvar.qnprefs.getIntPref("openqn");
		switch(openMethod) {
			case 0:
				document.getElementById('fbtbfunc-s').setAttribute('selected', true);
				document.getElementById('fbtbfunc-f').setAttribute('selected', false);
				document.getElementById('fbtbfunc-t').setAttribute('selected', false);
				break;
			case 1:
				document.getElementById('fbtbfunc-s').setAttribute('selected', false);
				document.getElementById('fbtbfunc-f').setAttribute('selected', true);
				document.getElementById('fbtbfunc-t').setAttribute('selected', false);
				break;
			case 2:
				document.getElementById('fbtbfunc-s').setAttribute('selected', false);
				document.getElementById('fbtbfunc-f').setAttribute('selected', false);
				document.getElementById('fbtbfunc-t').setAttribute('selected', true);
				break;
			}
		}
		if (teo_qn.qnGetPlatform(qnPlatform == 3)){
			document.getElementById("showinFirefoxButton").hidden = true;
		}
	},

	//On OK, sets the prefs chosen by the user.
	acceptQNSettings: function()
	{

		QN_globalvar.qnprefs.setIntPref("totabint", document.getElementById("totabint-radiogroup").value);
		var arr=["", "One", "Two", "Three", "Four","Five","Six"]
		for(var i=1;i<7;i++){nsPreferences.setUnicharPref('extensions.quicknote.tab'+i+'path', document.getElementById('QNTab'+arr[i]+'File').value);}

		// ##AutoSave Prefs ##
		if(document.getElementById('onclose').getAttribute('selected', true)){
			QN_globalvar.qnprefs.setIntPref('autosave', '0');
		}else if(document.getElementById('noautosave').getAttribute('selected', true)){
			QN_globalvar.qnprefs.setIntPref('autosave', '-1');
		}else{
			var AutosaveValue = document.getElementById('xthCharTB').value;
			QN_globalvar.qnprefs.setIntPref('autosave', AutosaveValue);
		}

		// ## File Encoding##
		/*var QnEncodingType;
		if (document.getElementById('EncodingList').value == null || document.getElementById('EncodingList').value == "undefined"){
			QnEncodingType = "UTF-8";
			nsPreferences.setUnicharPref('extensions.quicknote.charset', QnEncodingType);
		}else{
			QnEncodingType = document.getElementById('EncodingList').value;
			nsPreferences.setUnicharPref('extensions.quicknote.charset', QnEncodingType);
		}*/

		// ## Sets Number of Tabs ##
		QN_globalvar.qnprefs.setIntPref("numtabs", document.getElementById('numtab-radiogroup').value);

		// Set FB toolbar button behavior
		if(document.getElementById("fbtbfunc-s").getAttribute('selected')=='true'){QN_globalvar.qnprefs.setIntPref("openqn", 0)}
		if(document.getElementById("fbtbfunc-f").getAttribute('selected')=='true'){QN_globalvar.qnprefs.setIntPref("openqn", 1)}
		if(document.getElementById("fbtbfunc-t").getAttribute('selected')=='true'){QN_globalvar.qnprefs.setIntPref("openqn", 2)}

		//## Set Tab Font Colors
		var arr=["", "One", "Two", "Three", "Four","Five","Six"]
		try{
			for(var i=1;i<7;i++){
				nsPreferences.setUnicharPref('extensions.quicknote.fontcolor'+i, document.getElementById('QNTab'+arr[i]+'FontColor').color);
				QN_globalvar.qnprefs.setIntPref('fontsize'+i, document.getElementById('QNTab'+arr[i]+'Fontsizetb').value);
				nsPreferences.setUnicharPref('extensions.quicknote.fontname'+i, document.getElementById('QNTab'+arr[i]+'FontName').value);
				nsPreferences.setUnicharPref('extensions.quicknote.userstyle'+i, document.getElementById('UserStyleDefTab'+i).value);
				nsPreferences.setUnicharPref('extensions.quicknote.bgcolortab'+i, document.getElementById('QNTab'+arr[i]+'BGColor').color);
			}
	 }catch(e){}
		window.close();
	},

//Show Hide tab prefs Dynamically!
	showHideTabPaths: function()
	{
		if(document.getElementById("numtab-radiogroup").value<document.getElementById("totabint-radiogroup").value){
			 document.getElementById("totabint-radiogroup").value=1};
		var arr=["", "One", "Two", "Three", "Four","Five","Six"]
		var tf=false
		for(var i=1;i<7;i++){
			document.getElementById('QNTab'+arr[i]+'FileB').collapsed = tf
			document.getElementById('choose-tab'+i).disabled = tf
			document.getElementById('tabadvanced'+i).collapsed = tf
			if(document.getElementById('numtab-'+i).getAttribute('selected')){tf=true}
		}
	},

////////////////////////////////////////////////////////////////////////////////
// loaduserFile
//
// Desc: Loads the files by launching the FilePicker
// Parameters: targetNodeID: tab to which the file will be loaded
// Returns: false on error.
////////////////////////////////////////////////////////////////////////////////
	QN_loaduserFile: function(targetNodeID) {
		var stringBundle=document.getElementById("qnstrings");
		var myUserDirPlease = DirIO.get('UChrm').path;
		var fName = teo_qn.QN_txtFilePicker(stringBundle.getString("choose.file"),0,myUserDirPlease);
		if(fName==null){
				teo_qn.prompts.alert(null,"QuickNote",stringBundle.getString("alertinvalid.file"));
		 }else{
			document.getElementById(targetNodeID).value = fName;
		}
	},

	loaduserFile1: function() {teo_qn.QN_loaduserFile('QNTabOneFile')},
	loaduserFile2: function() {teo_qn.QN_loaduserFile('QNTabTwoFile')},
	loaduserFile3: function() {teo_qn.QN_loaduserFile('QNTabThreeFile')},
	loaduserFile4: function() {teo_qn.QN_loaduserFile('QNTabFourFile')},
	loaduserFile5: function() {teo_qn.QN_loaduserFile('QNTabFiveFile')},
	loaduserFile6: function() {teo_qn.QN_loaduserFile('QNTabSixFile')},

////////////////////////////////////////////////////////////////////////////////
// txtFilePicker
//
// Parameters:
//	aTitle: title to go on file picker window
//	aSave: 1 if picking file to save/overwrite, 0 if picking file to load
//	aStart: directory to start from
//		This must be an nsIFile.	new Dir("foo") in jslib/io/dir.js will
//		do the trick, but you have to do it yourself.
// Returns:
//	Name of file picked, in URL format, or null if cancelled
// Original taken and modified from Tagzilla.mozdev.org!
////////////////////////////////////////////////////////////////////////////////
	QN_txtFilePicker: function(aTitle, aSave) {
		var retVal = null;
		try {
			const nsIFilePicker = Components.interfaces.nsIFilePicker;
			var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
			fp.init(window, aTitle, (aSave ? nsIFilePicker.modeSave : nsIFilePicker.modeOpen));
			fp.appendFilters(nsIFilePicker.filterAll | nsIFilePicker.filterText);
			var result=fp.show();
			if (result == nsIFilePicker.returnOK || result == nsIFilePicker.returnReplace) {
				retVal=fp.file.path;
				}
			}
		catch (ex) {
		}
		return retVal;
	},

	qnGetPlatform: function(){
		var platform = navigator.platform.toLowerCase();
		if(platform.indexOf("win32") != -1){qnPlatform = 1;}
		if(platform.indexOf("win64") != -1){qnPlatform = 1;}
		if(platform.indexOf("linux") != -1){qnPlatform = 2;}
		if(platform.indexOf("unix") != -1){qnPlatform = 2;}
		if(platform.indexOf("darwin") != -1){qnPlatform = 3;}
		if(platform.indexOf("macintel") != -1){qnPlatform = 3;}
		if(platform.indexOf("macppc") != -1){qnPlatform = 3;}
	
		return qnPlatform;
	},

	qnCloseButtonEtc: function(){
		teo_qn.qnGetPlatform();
			if(qnPlatform == 2 || qnPlatform == 3){
				document.getElementById("qnMacAccept").hidden = false;
				document.getElementById("qnbuttons").hidden = true;
			}
	},

	qnhideDependent: function(){
		teo_qn.qnGetPlatform();
		if(qnPlatform == 2 || qnPlatform == 3){
			document.getElementById("showinAsDependentBox").hidden = true;
		}
	},

	qnasch: function(){
		var asave = document.getElementById("onxchar").selected;

		document.getElementById("xthCharLabel").collapsed = !asave;
		document.getElementById("xthCharTB").collapsed = !asave;
	},

	modeDisplay: function (){
		var qnPlatform = teo_qn.qnGetPlatform();
		var ctrl = document.getElementById("fbtbfunc-f").selected;
		var ctrl1 = document.getElementById("fbtbfunc-t").selected;

		if(qnPlatform == 1){		
		document.getElementById("displayBox").collapsed = !ctrl;
		document.getElementById("closeChildWindow").collapsed = !ctrl;
		document.getElementById("loadTabBackground").collapsed = !ctrl1;
		}
		else{
		document.getElementById("displayBox").collapsed = !ctrl;
		document.getElementById("loadTabBackground").collapsed = !ctrl1;
		}
		if(navigator.userAgent.search(/Firefox/gi) >= 0 || navigator.userAgent.search(/Thunderbird/gi) >= 0) {
			document.getElementById("qninfo1").collapsed = true;
		}
		if(navigator.userAgent.search(/SeaMonkey/gi) >= 0) {
			document.getElementById("qninfo1").collapsed = !ctrl1;
		}
		//Sets prefwindow height for Windows platform
		if(qnPlatform == 1){
			var prefwindow = document.getElementById("qnprefwindow");
			prefwindow.setAttribute("style", "min-height: 500px; max-height: 600px;");
		}	
	},
 
	childDisabled: function ()
	{
		var disp = document.getElementById("showinAsDependent").checked;
		var disp1 = document.getElementById("closeChildWindow").checked;

		document.getElementById("closeChildWindow").collapsed = disp;
		document.getElementById("qninfo").collapsed = !disp;
		document.getElementById("showinAsDependentBox").collapsed = disp1;
	}
}

var init = function ()
{
	teo_qn.loadQNSettings();
	teo_qn.showHideTabPaths();
	teo_qn.qnCloseButtonEtc();
	teo_qn.qnhideDependent();
	//teo_qn.modeDisplay();
	teo_qn.childDisabled();
}

window.addEventListener("load", function () {init();}, false);