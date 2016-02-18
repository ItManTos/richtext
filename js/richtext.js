/* ========================================================================
 * Rich Text: richtext.js v1.2
 * http://itman70s.github.io/
 * ======================================================================== */
 
$(document).ready(function(){
  $(this).bindRichText();
});


/* source codes for selection */
(function ($) {
  'use strict';
  var Selection = function Selection(element){
    this.$element = $(element);
    return this;
  };
  Selection.VERSION = '1.0';
  
  Selection.prototype.get = function () {
    var sel = window.getSelection();
    if (sel.getRangeAt && sel.rangeCount) {
      return sel.getRangeAt(0);
    }
  }
    
  Selection.prototype.save = function () { this.$element.data("bs.selection", this.get()); };
  Selection.prototype.restore = function () {
    var stn = this.$element.data("bs.selection");
    if (stn) {
      try {
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(stn);
      } catch (ex) {
        document.body.createTextRange().select();
        document.selection.empty();
      }
    }
  };
  Selection.prototype.mark = function (color) {
    this.restore();
    if (document.queryCommandSupported('hiliteColor')) {
      document.execCommand('hiliteColor', 0, color || this.$element.data("bs.selection.bs.color") || 'transparent');
    }
    this.$element.data("bs.selection.bs.color", color);
  };
  
  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data = $this.data('bs.selection')
      if (!data) $this.data('bs.selection', (data = new Selection(this)))
      if (typeof option == 'string' && option in data ) data[option]();
    })
  }
  var old = $.fn.selection;
  $.fn.selection = Plugin;
  $.fn.selection.noConflict = function () {
    $.fn.selection = old
    return this
  }
}(window.jQuery));

(function ($) {
  function bindhotkeys(hotkeys) {
    var keys = $.extend({
        'ctrl+b meta+b': 'bold',
        'ctrl+i meta+i': 'italic',
        'ctrl+u meta+u': 'underline',
        'ctrl+z meta+z': 'undo',
        'ctrl+y meta+y meta+shift+z': 'redo',
        'ctrl+l meta+l': 'justifyleft',
        'ctrl+r meta+r': 'justifyright',
        'ctrl+e meta+e': 'justifycenter',
        'ctrl+j meta+j': 'justifyfull',
        'return': '',
        'shift+return': '',
        'shift+tab': 'outdent',
        'tab': 'indent'
      }, hotkeys);
    var $editor = $(document);
    $.each(keys, function (hotkey, cmd) {
      $editor.keydown(hotkey, function (e) { filterKey(e, hotkey, cmd); }).keyup(hotkey, function (e) { filterKey(e, hotkey); });
    });
    function filterKey(e, hotkey, cmd) {
      if (!e || !hotkey) return;
      var input = $(e.target);
      if (!input || !input.attr('contenteditable') || !input.is(':visible')) return;
      
      // single line input area, ignore keys: shift+tab, tab, return.
      if (hotkey.match(/tab|return/gi)) {
        var t = input.attr("target-input") || input.attr("target-obj");
        if (t && $(t).prop("tagName") == "INPUT") {
          if (hotkey.match(/return/gi)) {
            e.preventDefault();
            e.stopPropagation();
          }
          return;
        }
        // "return" is used to ignore return key for one line input 
        if (hotkey.match(/return/gi)) {
          return;
        }
      }
      e.preventDefault();
      e.stopPropagation();
      if (cmd) {
        input.execute(cmd);
      }
    }
  };
  bindhotkeys();
}(window.jQuery));

(function ($) {
  'use strict';
  var read = function (fileInfo) {
    var loader = $.Deferred();
    var reader = new FileReader();
    reader.onload = function (e) {
      loader.resolve(e.target.result);
    };
    reader.onerror = loader.reject;
    reader.onprogress = loader.notify;
    reader.readAsDataURL(fileInfo);
    return loader.promise();
  };
  
  var userOptions = {};
var richTextOptions = {};
$.fn.bindRichText = function bindRichText() {
  $(".richtext").richtext();
  $(".richtextline").richtext();
  $(".richtextcode").richtext();
  $(".richtextcodeline").richtext();
  $(".divinput").richtext();
  $(".divinputs").richtext();
  
  $(document).on("focusout", ".richtext-zone", function() {showTools(this, true, false); });
  $(document).on("click", ".richtext-zone", function() {showTools(this, true, true);});
  $(document).on("click", "input", function() {showTools(this, false);});
  $(document).on("click", "textarea", function() {showTools(this, false);});
  $(document).on("click", "select", function() {showTools(this, false);});
  showTools(null, false);
  
}

$(document).on('click', '.switch-icon [data-toggle="tab"]', function() {
  var self = this;
  $(this.parentNode).find('[data-toggle="tab"]').each(function () { (this == self) ? $(this).addClass("active") : $(this).removeClass("active")  });
  if ($(self).attr("href").match(/.+\-m$/gi)) {
    $(self.parentNode.parentNode).find(".mvc-group-m").focus();
  }
});

/* source codes for one-line rich text */
function imginput(id, userOptions) {
  id = $("#" + id)[0] ? "#" + id : "[name='" + id + "']";
  $(id).wrap( "<div class='richtext-zone " + ($(id).attr("class").indexOf("col-") > -1 ? $(id).attr("class").replace(/(.*)(col\-[^ ]+)(.*)/gi, "$2") : "") + "'></div>");
  $('<div target-obj="' + id + '" class="editable min-h34"></div>').insertBefore(id);
  $(id).hide();
  
  var toolbar = '<div class="">\n' + 
'<a class="btn btn-default" id="pictureBtn_uuid" data-original-title="Insert picture (or just drag &amp; drop)"><img src="/img/add.png">Select Picture\n' + 
'<input type="file" data-role="magic-overlay" data-target="#pictureBtn_uuid" data-edit="insertImage" accept="image/*" style="opacity: 0; position: absolute; top: 0px; left: 0px; width: 33px; height: 28px;"></a>\n' + 
'</div>\n';
  
  $(toolbar).insertAfter(id);
  var input = $($(id)[0].parentNode).find(".editable");
  input.richtext(userOptions);
  input.html($(id).val());
}

function showTools(zone, display, focus) {
  if (!display) {
    $(".autohide").each(function() { $(this).hide(); });
    return;
  }
  var bar = $(zone).find(".btn-toolbar");
  var target = bar.attr("data-target")
  $(".autohide").each(function() { 
    if (bar.attr("data-target") && bar.attr("data-target") != $(this).attr("data-target")) {
      $(this).hide(); 
    } else {
      if (!bar.is(":visible")) {
        bar.show();
      }
    }
  });
  var target = $(zone).find(".editable").attr("target-obj");
  $('.richtext-zone').find('.editable').each(function () { 
    if ($(this).attr("target-obj") != target) {
      $(this).attr("contenteditable", false);
    } else {
      $(this).attr("contenteditable", true);
    }
  });
  if (focus && !$(zone).find(".editable").is(":focus")) {
    $(zone).find(".editable").focus();
  }
}

  $.fn.execute = function (cmd) {
    if (!cmd || guard(cmd)) return;
    
    var idx = cmd.indexOf(' ');
    idx = idx < 0 ? cmd.length: idx;
    document.execCommand(cmd.substring(0, idx), true, cmd.substr(idx));
  };

  var toolbar = function (editor, userOptions) {
    var bar = this;
    var $target = $(editor);
     // $(document).on("mousedown keydown mouseup keyup focus dbclick", "[contenteditable]", function() {$(this).closest(".richtext-zone").data("bs.editable", $(this));});
    /*
    if ($target.attr("rt-selector")) {
      var rts = $target.find($target.attr("rt-selector"));
      if (rts.length > 0) {
        rts.on('focus', function (e) {
          $target = $(this);
        });
        $target = rts.first();
      }
    }
    */
  };
  

  function showRichTextError(zone, reason, detail) {
    if (reason==='unsupported-file-type') { 
      reason = "Unsupported format";
    } else {
      console.log("error uploading file", reason, detail);
    }
    var msg = '<strong>Reason:</strong>&nbsp;' + reason + '&nbsp;&nbsp;<strong>Detail:</strong>&nbsp;' + detail ;
    msg = '<div class="alert alert-danger alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' + msg + '</div>';
    $(zone).parents(".richtext-zone").find(".alert-message").html(msg);
  };
  
// Rich Text Functions
function initBar(id, options) {
  userOptions = $.extend({}, options);
  userOptions["font"] = userOptions["font"] || "yes";
  userOptions["p"] = userOptions["p"] || "yes";
  userOptions["link"] = userOptions["link"] || "yes";
  userOptions["img"] = userOptions["img"] || "yes";
  userOptions["undo"] = userOptions["undo"] || "yes";
  userOptions["clear"] = userOptions["clear"] || "yes";
  userOptions["style"] = userOptions["style"] || "";
  userOptions["sfont"] = userOptions["sfont"] || "no";
  
  userOptions["error"] = function(reason, detail) {showRichTextError(this, reason, detail);}
  
  var pos = "z-index: 9; -moz-opacity:0.9; filter:alpha(opacity=90); opacity:0.9;position: absolute; ";
  userOptions["position"] = userOptions["position"] || "top right";
  if (userOptions["position"].indexOf("bottom") > -1) {
    // pos += "top: 30px;";
  } else {
    pos += "top: -30px;";
  }
  pos += (userOptions["position"].indexOf("left") > -1) ? "left:" : "right:";
  pos += (($(id).closest(".richtext-zone").attr("class") || "").indexOf("col-") > -1) ? "15px;" : "0px;";

  
  // TODO switch options for: font style color algin list link img
  var toolbar = '' + 
'<div class="btn-toolbar ' + ((userOptions["autohide"] != "no") ? "autohide" : "") + ' " data-role="editor-toolbar" data-target="' + id + '" style="' + pos + '">\n';

  if (userOptions["font"] != "no") {
    
  if (userOptions["sfont"] != "yes") {
  toolbar += "" + 
'<div class="btn-group">\n' + 
'  <a class="btn btn-default dropdown-toggle" data-toggle="dropdown" title="Font" data-original-title="Font"><b><i class="icon-font"></i></b><b class="icon-caret-down"></b></a>\n' + 
'  <ul class="dropdown-menu"><li></li></ul>\n' + 
'</div>\n' + 
'<div class="btn-group" style="margin-left: 0px;">\n' + 
'<a class="btn btn-default dropdown-toggle" data-toggle="dropdown" title="" data-original-title="Font Size"><b><i class="icon-text-width"></i></b><b class="icon-caret-down"></b></a>\n' + 
'<ul class="dropdown-menu">\n' + 
'  <li><a data-edit="fontSize 1"><font size="1">Very small</font></a></li>\n' + 
'  <li><a data-edit="fontSize 2"><font size="2">A bit small</font></a></li>\n' + 
'  <li><a data-edit="fontSize 3"><font size="3">Normal</font></a></li>\n' + 
'  <li><a data-edit="fontSize 4"><font size="4">Medium-large</font></a></li>\n' + 
'  <li><a data-edit="fontSize 5"><font size="5">Big</font></a></li>\n' + 
'  <li><a data-edit="fontSize 6"><font size="6">Very big</font></a></li>\n' + 
'  <li><a data-edit="fontSize 7"><font size="7">Maximum</font></a></li>\n' + 
'</ul>\n' + 
'</div>\n';
  }
  toolbar += "" + 
'<div class="btn-group" style="margin-left: 0px;">\n' + 
'<a class="btn btn-default" data-edit="bold" title="" data-original-title="Bold (Ctrl/Cmd+B)"><b><i class="icon-bold"></i></b></a>\n' + 
'<a class="btn btn-default" data-edit="italic" title="" data-original-title="Italic (Ctrl/Cmd+I)"><b><i class="icon-italic"></i></b></a>\n' + 
'<a class="btn btn-default" data-edit="underline" title="" data-original-title="Underline (Ctrl/Cmd+U)"><b><i class="icon-underline"></i></b></a>\n' + 
'<a class="btn btn-default" data-edit="strikethrough" title="" data-original-title="Strikethrough"><b><i class="icon-strikethrough"></i></b></a>\n' + 
'</div>\n' + 
'<div class="btn-group" style="margin-left: 0px;">\n' + 
'<a class="btn btn-default dropdown-toggle" data-toggle="dropdown" title="" data-original-title="Fore Color" style="color:blue;"><u><i class="icon-font"></i></u><b class="icon-caret-down"></b></a>\n' + 
'<ul class="dropdown-menu fore-color" style="width:230px">\n' + 
'</ul>\n' + 
'</div>\n';

  if (userOptions["sfont"] != "yes") {
  toolbar += "" + 
'<div class="btn-group" style="margin-left: 0px;">\n' + 
'<a class="btn btn-default dropdown-toggle" data-toggle="dropdown" title="" data-original-title="Background Color"><b style="background-color: blue;color:#EEE;"><i class="icon-font"></i><b class="icon-caret-down"></b></b></a>\n' + 
'<ul class="dropdown-menu Back-Color" style="width:230px;padding:2px;">\n' + 
'</ul>\n' + 
'</div>\n' + 
'\n';
  }
  
  }
  
  if (userOptions["p"] != "no") {
  toolbar += "" + 
'<div class="btn-group">\n' + 
'<a class="btn btn-default" data-edit="insertunorderedlist" title="" data-original-title="Bullet list"><i class="icon-list-ul"> </i></a>\n' + 
'<a class="btn btn-default" data-edit="insertorderedlist" title="" data-original-title="Number list"><i class="icon-list-ol"> </i></a>\n' + 
'<a class="btn btn-default" data-edit="indent" title="" data-original-title="Indent (Tab)"><i class="icon-indent-right"> </i></a>\n' + 
'<a class="btn btn-default" data-edit="outdent" title="" data-original-title="Reduce indent (Shift+Tab)"><i class="icon-indent-left"> </i></a>\n' + 
'</div>\n' + 
'\n' + 
'<div class="btn-group">\n' + 
'<a class="btn btn-default" data-edit="justifyleft" title="" data-original-title="Align Left (Ctrl/Cmd+L)"><i class="icon-align-left"> </i></a>\n' + 
'<a class="btn btn-default" data-edit="justifycenter" title="" data-original-title="Center (Ctrl/Cmd+E)"><i class="icon-align-center"> </i></a>\n' + 
'<a class="btn btn-default" data-edit="justifyright" title="" data-original-title="Align Right (Ctrl/Cmd+R)"><i class="icon-align-right"> </i></a>\n' + 
'<a class="btn btn-default" data-edit="justifyfull" title="" data-original-title="Justify (Ctrl/Cmd+J)"><i class="icon-align-justify"> </i></a>\n' + 
'</div>\n' + 
'\n';
  }
  if (userOptions["icons"]) {
    toolbar += '<div class="btn-group">\n' + 
'<a class="btn btn-default dropdown-toggle" data-toggle="dropdown" title="" data-original-title="Icons"><img src="' + userOptions["icons"][0] + '"><b class="icon-caret-down"></b></a>\n' + 
'<ul class="dropdown-menu" style="width:244px;padding:4px">\n' + 
'  <li> \n' + 
'  <div class="btn-group btn-group-xs"><a class="btn hide" ></a>\n';
    for (var i in userOptions["icons"]) {
      toolbar += '<a class="btn btn-default" data-edit="insertimage ' + userOptions["icons"][i] + '"><img src="' + userOptions["icons"][i] + '"></a>\n';
    }
    toolbar += '  </div></li></ul>\n</div>\n\n';
  }
  
  if (userOptions["img"] != "no") {
    var sqno = getSid();
  toolbar += "" + 
'<div class="btn-group"' + ((userOptions["icons"]) ? ' style="margin-left: 0px;"' : '') + '>\n' + 
'<a class="btn btn-default" title="" id="picture_uuid_' + sqno + '" data-original-title="Insert picture (or just drag &amp; drop)"><b><i class="icon-picture"> </i></b>\n' + 
'<input type="file" data-role="magic-overlay" data-target="#picture_uuid_' + sqno + '" data-edit="insertImage" accept="image/*" style="opacity: 0; position: absolute; top: 0px; left: 0px; width: 33px; height: 28px;"></a>\n' + 
'</div>\n' + 
'\n';
  }

  if (userOptions["link"] != "no") {
  toolbar += "" + 
'<div class="btn-group"' + ((userOptions["icons"] || userOptions["img"] != "no") ? ' style="margin-left: 0px;"' : '') + '>\n' + 
'<a class="btn btn-default dropdown-toggle" data-toggle="dropdown" title="" data-original-title="Hyperlink"><i class="icon-link"> </i></a>\n' + 
'<ul class="dropdown-menu col-md-6"><li class="input-group "><input type="text" class="form-control" value="http://"><span class="input-group-btn"><a class="btn btn-default" data-edit="createLink">Link</a></span></li></ul>\n' + 
'<a class="btn btn-default" data-edit="unlink" title="" data-original-title="Remove Hyperlink"><i class="icon-link" style="text-decoration: line-through;"> </i></a>\n' + 
'</div>\n' + 
'\n';
  }
  if (userOptions["undo"] != "no") {
  toolbar += "" + 
'<div class="btn-group">\n' + 
'<a class="btn btn-default" data-edit="undo" title="" data-original-title="Undo (Ctrl/Cmd+Z)"><i class="icon-reply"> </i></a>\n' + 
'<a class="btn btn-default" data-edit="redo" title="" data-original-title="Redo (Ctrl/Cmd+Y)"><i class="icon-share-alt"> </i></a>\n' + 
'</div>\n' + 
'\n';
  }
  if (userOptions["clear"] != "no") {
  toolbar += "" + 
'<div class="btn-group"' + ((userOptions["undo"] != "no") ? ' style="margin-left: 0px;"' : '') + '>\n' + 
'<a class="btn btn-default" data-edit="removeFormat" title="" data-original-title="Clear Format"><i class="icon-remove"> </i></a>\n' + 
'</div>\n' + 
'\n';
  }
  toolbar += '<br /><div class="alert-message" style="position: absolute; left:4px; right: 0px; top: 30px; display: block;"></div></div>\n';
  var $target = $(id).closest(".richtext-zone");
  if ($(id).hasClass("mvc-group-m")) {
    $target = $target.find(".mvc-group-v");
  }
  if (userOptions["position"].indexOf("bottom") > -1) {
    $target.append(toolbar);
  } else {
    $target.prepend(toolbar);
  }
/*
* 宋体  SimSun  \5B8B\4F53
* 黑体  SimHei  \9ED1\4F53
* 微软雅黑  Microsoft YaHei  \5FAE\8F6F\96C5\9ED1
* 华文细黑  STHeiti Light [STXihei]  \534E\6587\7EC6\9ED1
* 华文黑体  STHeiti  \534E\6587\9ED1\4F53
*/
  var fonts = ['Serif', 'Sans', 'Arial', 'Arial Black', 'Courier', 'Courier New', 'Comic Sans MS', 'Helvetica', 'Impact', 'Lucida Grande', 'Lucida Sans', 'Tahoma', 'Times',
    'Times New Roman', 'Verdana', '\u5B8B\u4F53', '\u9ED1\u4F53', '\u5FAE\u8F6F\u96C5\u9ED1', '\u534E\u6587\u7EC6\u9ED1', '\u534E\u6587\u9ED1\u4F53'];
  var tbar = $(id).parent().find('.btn-toolbar');
  $(tbar).find('[title=Font]').each(function() {
  var fontTarget = $(this).siblings('.dropdown-menu');
  $.each(fonts, function (idx, fontName) {
    fontTarget.append($('<li><a data-edit="fontName ' + fontName +'" style="font-family:\''+ fontName +'\'">'+fontName + '</a></li>'));
  });
  });
  var colors = [{color: "#000000", style: "color:silver;", title: "Black"},
        {color: "#333333", style: "color:silver;", title: "Very dark gray"},
        {color: "#555555", style: "color:silver;", title: "Dark555"},
        {color: "#808080", style: "", title: "Gray"},
        {color: "#999999", style: "", title: "Medium gray"},
        {color: "#C0C0C0", style: "", title: "Silver"},
        {color: "#D3D3D3", style: "", title: "Light grey"},
        {color: "#FFFFFF", style: "", title: "White"},
        {color: "#800000", style: "color:silver;", title: "Maroon"},
        {color: "#A52A2A", style: "color:silver;", title: "Brown"},
        {color: "#FF0000", style: "", title: "Red"},
        {color: "#FF6600", style: "", title: "Orange"},
        {color: "#FF9900", style: "", title: "Amber"},
        {color: "#FFCC00", style: "", title: "Gold"},
        {color: "#FFFF00", style: "", title: "Yellow"},
        {color: "#FFFF99", style: "", title: "Light yellow"},
        {color: "#800080", style: "color:silver;", title: "Purple"},
        {color: "#9400D3", style: "color:silver;", title: "Dark violet"},
        {color: "#CC99FF", style: "", title: "Plum"},
        {color: "#FF1493", style: "", title: "Deep Pink"},
        {color: "#FF00FF", style: "", title: "Magenta"},
        {color: "#EE82EE", style: "", title: "violet"},
        {color: "#FF99CC", style: "", title: "Pink"},
        {color: "#FFCC99", style: "", title: "Peach"},
        {color: "#000080", style: "color:silver;", title: "Navy Blue"},
        {color: "#0000FF", style: "color:silver;", title: "Blue"},
        {color: "#3366FF", style: "color:silver;", title: "Royal blue"},
        {color: "#33CCCC", style: "", title: "Turquoise"},
        {color: "#00CCFF", style: "", title: "Sky blue"},
        {color: "#00FFFF", style: "", title: "Aqua"},
        {color: "#99CCFF", style: "", title: "Light sky blue"},
        {color: "#ADD8E6", style: "", title: "Light blue"},
        {color: "#003300", style: "color:silver;", title: "Dark green"},
        {color: "#008000", style: "color:silver;", title: "Green"},
        {color: "#339966", style: "color:silver;", title: "Sea green"},
        {color: "#99CC00", style: "", title: "Yellow green"},
        {color: "#ADFF2F", style: "", title: "Green Yellow "},
        {color: "#00FF00", style: "", title: "Lime"},
        {color: "#90EE90", style: "", title: "Light green"},
        {color: "#CCFFCC", style: "", title: "Pale green"}  ];
  var total = 0;
  var htmFore = "";
  var htmBack = "";
  $.each(colors, function (idx, color) {
    if (total == 0) {
      htmFore += '  <li> \n  <div class="">\n';
    }
    htmFore += '  <a class="color-box" data-edit="ForeColor ' + color["color"] + '" style="background-color: ' + color["color"] + ';' + color["style"] + '" title="' + color["title"] + '">' + color["title"].charAt(0) + '</a>\n';
    
    total++;
    if (total == 8) {
      htmFore += '  </div></li>\n';
      total = 0;
    }
  });
  if (total != 0) {
    htmFore += '  </div></li>\n';
  }
  htmBack = htmFore.replace(/ForeColor/g, "BackColor") + '  <li>\n' + 
        '  <div class="btn-group">\n' + 
        '  <a class="color-box" data-edit="BackColor transparent" style="background-color: transparent;margin-left:200px;" title="No Color">X</a>\n' + 
        '  </div>\n' + 
        '  </li>\n';
  $(tbar).find('.fore-color').each(function() { $(this).append($(htmFore)); });
  $(tbar).find('.Back-Color').each(function() { $(this).append($(htmBack)); });

  $(tbar).find('a[title]').tooltip({container:'body'});
  $(tbar).find('.dropdown-menu input').click(function() {return false;}).change(function () {$(this).parent('.dropdown-menu').siblings('.dropdown-toggle').dropdown('toggle');}).keydown('esc', function () {this.value='';$(this).change();});

  $(tbar).find('[data-role=magic-overlay]').each(function () { 
  var overlay = $(this), target = $(overlay.data('target')); 
  overlay.css('opacity', 0).css('position', 'absolute').offset(target.offset()).width(target.outerWidth()).height(target.outerHeight());
  });
};

  var RichText = function (type, element, userOptions) {
    this.type = type;
    this.options = {};
    this.$element = $(element);
    this.$zone = null;
    this.selector = null;
    this.single = (this.$element.prop("tagName") == "INPUT");
    var instance = this;
    instance.id = "RichText_" + getSid();
    
    this.init_section();
    this.init_val();
    
    // initial toolbar from here
    if (this.type == "divinput") {
      return this;
    }
    
    var opt = {};
    if (this.single) {
      opt["p"] = "no";
    //  opt["img"] = "no";
      opt["undo"] = "no";
      opt["clear"] = "no";
    }
    if (this.type == "divinputs") {
      opt["autohide"] = "no";
      opt["shared"] = "yes";
    }
    if (this.type == "richtextcode") {
      opt["position"] = "bottom right";
    }
  
    // todo fix richTextOptions and userOptions
    this.options = $.extend({}, richTextOptions, opt, userOptions, this.$element.attr("options") && JSON.parse(this.$element.attr("options")));
    this.selector = this.$element.attr("id") ? "#" + this.$element.attr("id") : this.$element.attr("target-obj");
    initBar(this.selector, this.options);
    if (this.options["baronly"] == "yes") {
      return this;
    }
    
    

    var options = {
      commandRole: 'edit',
      active: 'btn-info',
      shared: (this.type == "divinputs"),
      drop: true,
      error: function (reason, detail) { showRichTextError(editor, reason, detail); }
    };
    options = $.extend(options, userOptions);
    
    var $target = this.$zone.find("[contenteditable]:first");
    this.$zone.find('input[type=file][data-' + options.commandRole + ']').change(function () {
      var $target = restoreSelection(this);
      if (this.type === 'file' && this.files && this.files.length > 0) {
        insertFiles($target, this.files);
      }
      this.value = '';
    });
    // drop file event
    this.$zone.find(".editable").on('drop', function (e) {
      var dataTransfer = e.originalEvent.dataTransfer;
      if (dataTransfer && dataTransfer.files && dataTransfer.files.length > 0) {
        insertFiles(dataTransfer.files);
        e.stopPropagation();
        e.preventDefault();
      }
    });
    function insertFiles($target, files) {
      $target.focus();
      $.each(files, function (idx, fileInfo) {
        if (/^image\//.test(fileInfo.type)) {
          $.when(read(fileInfo)).done(function (dataUrl) {
            execCommand('insertimage', dataUrl);
          }).fail(function (e) {
            options.error("file-reader", e);
          });
        } else {
          options.error("unsupported-file-type", fileInfo.type);
        }
      });
    }
    
    this.$zone.find("[contenteditable]").on("mousedown keydown dbclick", saveSelection);
    this.$zone.find("[contenteditable]").on("mouseup keyup", function() {
      saveSelection();
      update();
    });
    function saveSelection() {
      var $zone = $(this).closest(".richinput-zone, .richtext-zone");
      $zone.selection("save");
      $zone.data("bs.target.bs.div", $(this));
    }
    function restoreSelection(element) {
      var $zone = $(element).closest(".richinput-zone, .richtext-zone");
      $zone.selection("restore");
      var $div = $zone.data("bs.target.bs.div");
      if (!$div) {
        $div = $zone.find("[contenteditable]:first");
      }
      $div.focus();
      return $div;
    }
    var toolbarBtnSelector = 'a[data-edit],button[data-edit],input[type=button][data-edit]'.replace(/edit/g, options.commandRole);
    var $barBtn = this.$zone.find(toolbarBtnSelector);
    $barBtn.click(function () {
      var $btn = $(this);
      restoreSelection(this);
      if ($btn.data(options.commandRole) == "createLink") {
        var $link = $btn.parents(".input-group").find("input");
        execCommand("createLink " + $link.val());
        $link.val("http://");
      } else {
        execCommand($btn.data(options.commandRole));
      }
    });
    this.$zone.find('[data-toggle=dropdown]').click(function() {
      restoreSelection(this);
    });

    var update = function() {
      if (options.active) {
        $barBtn.each(function () {
          var command = $(this).data(options.commandRole);
          if (document.queryCommandState(command)) {
            $(this).removeClass("btn-default");
            $(this).addClass(options.active);
          } else {
            if ($(this).attr("class")) {
              $(this).attr("class", $(this).attr("class").replace(options.active, "btn-default"));
            }
          }
        });
      }
    };
    function execCommand(commandWithArgs, valueArg) {
      var $target = restoreSelection(this);
      $target.execute(commandWithArgs + ' ' + (valueArg || ''));
      update();
      var t = $target.attr("target-obj");
      $(t).val($target.html());
      $(t).change();
      //editor.selection.restore();
    };
    
    
    $(window).bind('touchend', function (e) {
      restoreSelection(this);
      var isInside = ($target.is(e.target) || $target.has(e.target).length > 0),
        currentRange = $target.selection("get"),
        clear = currentRange && (currentRange.startContainer === currentRange.endContainer && currentRange.startOffset === currentRange.endOffset);
      if (!clear || isInside) {
        $target.selection("save");
        bar.update();
      }
    });
  };
  
  RichText.VERSION  = '1.2'
  
  RichText.prototype.init_val = function () {
    if (this.type.indexOf("richtext") < 0) {
      return;
    }
    var val = this.$element.val();
    if (!this.$element.prop("tagName").match(/input|textarea/gi)) {
      val = this.$zone.find("input, textarea").val();
    }
    this.$zone.find(".editable").html(val);
  }
  
  
  RichText.prototype.init_section = function () {
    var id = this.$element.attr("id");
    var css = (this.$element.attr("class").indexOf("col-") > -1 ? this.$element.attr("class").replace(/(.*)(col\-[^ ]+)(.*)/gi, "$2") : "");
    var style = __getEidtorStyle("#" + id);
    var title = this.$element.attr("placeholder") || this.$element.attr("title") || "";
    switch(this.type) {
      case "divinput":
        this.$element.wrap( "<div class='richinput-zone " + css + "'></div>");
        var html = '<div class="editable ' + (this.$element.attr("class") || '').replace(/(col\-[^ ]+)/gi, "") + '" style="' + style + '" contenteditable="true" target-input="' + id + '" title="' + title.replace(/"/g, '\\"') + '">' + (this.$element.val() || title) + '</div>\n';
        $(html).insertAfter(this.$element);
        this.$element.hide();
      break;
      case "divinputs":
        this.$element.wrap( "<div class='richtext-zone " + css + "'></div>");
      break;
      case "richtext":
      case "richtextline":
          this.$element.wrap( "<div class='richtext-zone " + css + "'></div>");
          $('<div target-obj="#' + id + '" class="editable" style="' + style + '" contenteditable="true" title="' + title + '"></div>').insertBefore(this.$element);
          this.$element.hide();
      break;
      case "richtextcode":
      case "richtextcodeline":
        this.$element.addClass("mvc-group-m");
        this.$element.wrap( '<div class="richtext-zone tab-content ' + css + '"><div class="tab-pane" id="' + id + '-m"> </div></div>');
        
        var html = '<div class="switch-icon">\n' + 
            '  <a class="btn active" href="#' + id + '-v" data-toggle="tab" title="esay mode">view</a>\n' + 
            '  <a class="btn" href="#' + id + '-m" data-toggle="tab" title="expert mode">code</a>\n' + 
            '</div>\n' + 
            '<div class="tab-pane mvc-group-v active" id="' + id + '-v" ><div id="' + id + '-v-e" target-obj="#' + id + '" class="editable" style="' + style + '" contenteditable="true" title="' + title + '"></div>\n' + 
            '</div>\n';
        $(html).insertBefore('#' + id + '-m');
        this.$element = $('#' + id + '-v-e');
      break;
      default:
      break;
    }
    this.$zone = this.$element.closest((this.type == "divinput" ? ".richinput-zone" : ".richtext-zone"));
      
    this.$zone.find("[target-input]").on("focus", function() {
      var $self = $(this);
      if ($self.html() == $self.attr("title")) {
        $self.html("");
      }
    });
    
    this.$zone.find("[target-input]").on("blur", function() {
      var $self = $(this);
      $($self.attr("target-input")).val($self.html());
      if ($self.html() == "") {
        $self.html($self.attr("title"));
      }
    });
    
    this.$zone.find("[target-obj]").on("blur", function() {
      var $self = $(this);
      var t = $self.attr("target-obj");
      if (t && $(t).val() != $self.html()) {
        $(t).val($self.html());
        $(t).change();
      }
    });
  }
  
function __getEidtorStyle(id) {
  var height = 34;

  if ($(id).prop("tagName") == "TEXTAREA") {
    height = 34 + 20 * (($(id).attr("rows") || 2) -1);
    height = 'height: ' + height + 'px;overflow-y: scroll;';
  } else if ($(id).prop("tagName") == "INPUT") {
    height = 'min-height: ' + 34 + 'px;';
  } else {
    height = $(id).innerHeight();
    if (height < 34) {
      height = 34;
    }
    height = 'height: ' + height + 'px;overflow-y: scroll;';
  }
  return height;
}
  function Plugin(option) {
   return this.each(function () {
      var $self = $(this);
      var css = "";
      var id = $self.attr("id") || "";
      if (id == "") {
        id = "richtext_" + getSid();
        $self.attr("id", id);
      }
     
      if ($self.hasClass('richtextcode')) {
        css = "richtextcode";
      } else if ($self.hasClass('richtext')) {
        css = "richtext";
      } else if ($self.hasClass('divinputs')) {
        css = "divinputs";
      } else if ($self.hasClass('divinput')) {
        css = "divinput";
      } else if ($self.data("toggle") == "richtext") {
        css = $self.data("type") || "richtext";
      }
      $self.removeClass(css);
      $self.data("toggle", css);
      
       new RichText(css, this, option);  
       return;


      var $this   = $(this)
      var data    = $this.data('bs.richtext')
      var options = typeof option == 'object' && option

      if (!data && /destroy|hide/.test(option)) return
      if (!data) $this.data('bs.richtext', (data = new RichText(options)))
      if (typeof option == 'string') data[option]()
    }) 
  }

  var old = $.fn.richtext
  $.fn.richtext = Plugin
  $.fn.richtext.Constructor = RichText

  $.fn.richtext.noConflict = function () {
    $.fn.richtext = old
    return this
  }
}(window.jQuery));

var guard_keys = {};
function guard(key, within) {
  if (!key) return false;
  if (!within) within = 100;
  var lst = guard_keys[key] ? guard_keys[key] : 0;
  guard_keys[key] = new Date() - 0;
  return (lst + within > guard_keys[key]);
};

var getSid = null;
(function(){
    var num = 1;
    function increase (){
        num += 1;
        return num;
    }
    getSid = increase;
})();

