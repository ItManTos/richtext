/* ========================================================================
 * Rich Text: richtext.js v1.1
 * http://itman70s.github.io/
 * ======================================================================== */
 
$(document).ready(function(){
	$(document).bindhotkeys();
	bindRichText();
});
var richtext_version = 1.1;

var richTextOptions = {};
function bindRichText() {
	$('.richtextcode').each(function () { 
		var self = this;
		$(self).removeClass("richtextcode");
		var id = $(self).attr("id") || $(self).attr("name");
		if ($(self).prop("tagName") == "TEXTAREA") {
			richtextcode(id);
		} else if ($(self).prop("tagName") == "INPUT") {
			richtextcodeline(id);
		} else {
			// TODO
		}
	});	
	$('.richtext').each(function () {
		$(this).removeClass("richtext");
		var self = this;
		var id = $(self).attr("id") || $(self).attr("name");
		if ($(self).prop("tagName") == "TEXTAREA") {
			richtext(id);
		} else if ($(self).prop("tagName") == "INPUT") {
			richtextline(id);
		} else {
			// TODO
		}
	});
	$('.divinputs').each(function () {
		$(this).removeClass("divinputs");
		var self = this;
		var id = $(self).attr("id") || $(self).attr("name");
		divinputs(id);
	});
	
	$('.divinput').each(divinput);

	$(document).on("focusout", ".richtext-zone", function() {showTools(this, true, false); });
	$(document).on("click", ".richtext-zone", function() {showTools(this, true, true);});
	$(document).on("click", "input", function() {showTools(this, false);});
	$(document).on("click", "textarea", function() {showTools(this, false);});
	$(document).on("click", "select", function() {showTools(this, false);});
	showTools(null, false);
	
	$(document).on("focus", "[target-input]", function() {
		var self = this;
		var a = $(self).html();
		var aa = $(self).attr("title");
		if ($(self).html() == $(self).attr("title")) {
			$(self).html("");
		}
	});
	$(document).on("blur", "[target-input]", function() {
		var self = this;
		var t =  $(self).attr("target-input");
		$(t).val($(self).html());
		if ($(self).html() == "") {
			$(self).html($(self).attr("title"));
		}
	});
	$(document).on("mousedown keydown mouseup keyup focus dbclick", "[contenteditable]", function() {richtext_editor = $(this);});
	$(document).on("mouseup keyup mouseout", "[contenteditable]", function() {selection($("[contenteditable]")).save();});
	$(document).on("blur", "[target-obj]", function() {
		var t =  $(this).attr("target-obj");
		if (t && $(t).val() != $(this).html()) {
			$(t).val($(this).html());
			$(t).change();
		}
	});
}

$(document).on('click', '.switch-icon [data-toggle="tab"]', function(){
	var self = this;
	$(this.parentNode).find('[data-toggle="tab"]').each(function () { (this == self) ? $(this).addClass("active") : $(this).removeClass("active")	});
	if ($(self).attr("href").match(/.+\-m$/gi)) {
		$(self.parentNode.parentNode).find(".mvc-group-m").focus();
	}
});

/* source codes for one-line rich text */
function divinput() {
	var self = this;
	$(self).removeClass("divinput");
	var id = $(self).attr("id") || "";
	if (id != "") {
		id = "#" + id;
	} else {
		id = $(self).attr("name") || "";
		if (id != "") {
			id = "[name='" + id + "']";
		} else {
			sqno++;
			$(self).attr("id", "divinput" + sqno);
			id = "#divinput" + sqno;
		}
	}
	
	$(id).wrap( "<div class='richinput-zone " + ($(id).attr("class").indexOf("col-") > -1 ? $(id).attr("class").replace(/(.*)(col\-[^ ]+)(.*)/gi, "$2") : "") + "'></div>");
	var placeholder = $(self).attr("placeholder") || $(self).attr("title") || "";
	var toolbar = '<div class="editable ' + ($(self).attr("class") || '') + '" style="' + __getEidtorStyle(id) + '"  contenteditable="true" target-input="' + id + '" title="' + placeholder.replace(/"/g, '\\"') + '">' + ($(self).val() || placeholder) + '</div>\n';
	$(toolbar).insertAfter(id);
	
	$(id).hide();
}
/* source codes for rich text */
function divinputs(id, options) {
	id = $("#" + id)[0] ? "#" + id : "[name='" + id + "']";
	if (!$(id)[0]) return;
	
	userOptions = $.extend({}, richTextOptions, {autohide:"no"},options, ($(id).attr("options") + "").toJSON());
	//userOptions["style"] = "z-index: 9; position: absolute; right: 15px; top: -30px; -moz-opacity:0.9; filter:alpha(opacity=90); opacity:0.9;";
	
	$(id).wrap( "<div class='richtext-zone " + ($(id).attr("class").indexOf("col-") > -1 ? $(id).attr("class").replace(/(.*)(col\-[^ ]+)(.*)/gi, "$2") : "") + "'></div>");
	var rtn = $(id).richtextbar(userOptions);

	return rtn;
}
var richtext_editor = $(document);

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
	input.richtextbar(userOptions);
	input.html($(id).val());
}

/* source codes for one-line rich text */
function richtextline(id, options) {
	userOptions = $.extend({}, options);
	userOptions["p"] = "no";
	userOptions["undo"] = "no";
	return __richtext(id, userOptions);
	
}


/* source codes for rich text */
function richtext(id, userOptions) {
	return __richtext(id, userOptions);
}

function richtextcodeline(id,  options) {
	userOptions = $.extend({}, options);
	userOptions["p"] = "no";
	userOptions["img"] = "no";
	userOptions["undo"] = "no";
	userOptions["clear"] = "no";
	return richtextcode(id, userOptions);
}

function richtextcode(id,  options) {
	var oid = id;
	id = $("#" + id)[0] ? "#" + id : "[name='" + id + "']";
	
	userOptions = $.extend({}, richTextOptions, options, ($(id).attr("options") + "").toJSON());
	
	$(id).addClass("mvc-group-m");
	$(id).wrap( '<div class="richtext-zone tab-content ' + ($(id).attr("class").indexOf("col-") > -1 ? $(id).attr("class").replace(/(.*)(col\-[^ ]+)(.*)/gi, "$2") : "") + '"><div class="tab-pane" id="' + oid + '-m"> </div></div>');
	
	var html = '<div class="switch-icon">\n' + 
			'	<a class="btn active" href="#' + oid + '-v" data-toggle="tab" title="esay mode">view</a>\n' + 
			'	<a class="btn" href="#' + oid + '-m" data-toggle="tab" title="expert mode">code</a>\n' + 
			'</div>\n' + 
			'<div class="tab-pane mvc-group-v active" id="' + oid + '-v" ><div id="' + oid + '-v-e" target-obj="' + id + '" class="editable" style="' + __getEidtorStyle(id) + '" title="' + ($(id).attr("title") || $(id).attr("placeholder") || "") + '"></div>\n' + 
			'</div>\n';
	$(html).insertBefore('#' + oid + '-m');
	
	userOptions["bottom"] = "yes";
	userOptions["style"] = "z-index: 9; position: absolute; right: 15px; bottom: -30px; -moz-opacity:0.9; filter:alpha(opacity=90); opacity:0.9;";

	var input = $('#' + oid + '-v-e');
	var rtn = input.richtextbar(userOptions);
	input.html($(id).val());
	return rtn;
}

/* source codes for rich text */
function __richtext(id, options) {
	id = $("#" + id)[0] ? "#" + id : "[name='" + id + "']";
	if (!$(id)[0]) return;
	
	userOptions = $.extend({}, richTextOptions, options, ($(id).attr("options") + "").toJSON());
	
	$(id).wrap( "<div class='richtext-zone " + ($(id).attr("class").indexOf("col-") > -1 ? $(id).attr("class").replace(/(.*)(col\-[^ ]+)(.*)/gi, "$2") : "") + "'></div>");
	$('<div target-obj="' + id + '" class="editable" style="' + __getEidtorStyle(id) + '" title="' + ($(id).attr("title") || $(id).attr("placeholder") || "") + '"></div>').insertBefore(id);
	$(id).hide();
	
	userOptions["style"] = "z-index: 9; position: absolute; right: 15px; top: -30px; -moz-opacity:0.9; filter:alpha(opacity=90); opacity:0.9;";
	
	var input = $($(id)[0].parentNode).find(".editable");
	var rtn = input.richtextbar(userOptions);
	input.html($(id).val());
	return rtn;
}

function __getEidtorStyle(id) {
	var height = 34;
	
	if ($(id).prop("tagName") == "TEXTAREA") {
		height = 34 + 20 * (($(id).attr("rows") || 2) -1);
		height = 'height: ' + height + 'px;overflow-y: scroll;';
	} else if ($(id).prop("tagName") == "INPUT") {
		height = 'height: ' + 34 + 'px;';
	} else {
		height = $(id).innerHeight();
		if (height < 34) {
			height = 34;
		}
		height = 'height: ' + height + 'px;overflow-y: scroll;';
	}
	return height;
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

/* source codes for rich text and its bar */
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
	
	$.fn.bindhotkeys = function (hotkeys) {
		hotkeys = $.extend({
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
		var editor = $(this);
		$.each(hotkeys, function (hotkey, cmd) {
			editor.keydown(hotkey, function (e) { filterKey(e, hotkey, cmd); }).keyup(hotkey, function (e) { filterKey(e, hotkey); });
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
	
	$.fn.execute = function (cmd) {
		if (!cmd || guard(cmd)) return;
		
		var idx = cmd.indexOf(' ');
		idx = idx < 0 ? cmd.length: idx;
		document.execCommand(cmd.substring(0, idx), true, cmd.substr(idx));
	};

	$.fn.toolbar = function (userOptions, editor) {
		var tbar = this;
		if (!editor) editor = $(this);
		var bar = $(editor[0].parentNode);
		var options = {
			commandRole: 'edit',
			active: 'btn-info',
			drop: true,
			error: function (reason, detail) { console.log("File upload error", reason, detail); }
		};
		
		if ($(editor).attr("rt-selector")) {
			var rts = editor.find($(editor).attr("rt-selector"));
			if (rts.length > 0) {
				rts.on('focus', function (e) {
					editor = $(this);
				});
				editor = rts.first();
			}
		}
		options = $.extend(options, userOptions);
		
		if (options.drop) {
			editor.on('drop', function (e) {
				var dataTransfer = e.originalEvent.dataTransfer;
				if (dataTransfer && dataTransfer.files && dataTransfer.files.length > 0) {
					insertFiles(dataTransfer.files);
					e.stopPropagation();
					e.preventDefault();
				}
			});
		}
		var toolbarBtnSelector = 'a[data-edit],button[data-edit],input[type=button][data-edit]'.replace(/edit/g, options.commandRole);
		
		bar.find(toolbarBtnSelector).click(function () {
			var btn = $(this);
			selection(editor).restore();
			editor.focus();
			if (btn.data(options.commandRole) == "createLink") {
				var ipt = btn.parents(".input-group").find("input");
				tbar.execCommand("createLink " + ipt.val());
				ipt.val("http://");
			} else {
				tbar.execCommand(btn.data(options.commandRole));
			}
			selection(editor).save();
		});
		bar.find('[data-toggle=dropdown]').click(function() {selection(editor).restore();});

		bar.find('input[type=file][data-' + options.commandRole + ']').change(function () {
			selection(editor).restore();
			if (this.type === 'file' && this.files && this.files.length > 0) {
				insertFiles(this.files);
			}
			selection(editor).save();
			this.value = '';
		});
		this.update = function() {
			if (options.active) {
				bar.find(toolbarBtnSelector).each(function () {
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
		this.execCommand = function(commandWithArgs, valueArg) {
			editor.execute(commandWithArgs + ' ' + (valueArg || ''));
			tbar.update();
			var t = editor.attr("target-obj");
			$(t).val(editor.html());
			$(t).change();
			//selection(editor).restore();
		};
		
		function insertFiles(files) {
			editor.focus();
			$.each(files, function (idx, fileInfo) {
				if (/^image\//.test(fileInfo.type)) {
					$.when(read(fileInfo)).done(function (dataUrl) {
						tbar.execCommand('insertimage', dataUrl);
					}).fail(function (e) {
						options.error("file-reader", e);
					});
				} else {
					options.error("unsupported-file-type", fileInfo.type);
				}
			});
		}
		editor.attr('contenteditable', true)
			.on('mouseup keyup mouseout', function () {
				selection(editor).save();
				tbar.update();
			});
		$(window).bind('touchend', function (e) {
			var isInside = (editor.is(e.target) || editor.has(e.target).length > 0),
				currentRange = selection(editor).get(),
				clear = currentRange && (currentRange.startContainer === currentRange.endContainer && currentRange.startOffset === currentRange.endOffset);
			if (!clear || isInside) {
				selection(editor).save();
				tbar.update();
			}
		});
		return this;
	};
	

// Rich Text Functions
var sqno = 0;
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
	
	userOptions["error"] = function(reason, detail) {showRichTextError($(id).parents(".richtext-zone"), reason, detail);}
	
	// TODO switch options for: font style color algin list link img
	var toolbar = '' + 
'<div class="btn-toolbar ' + ((userOptions["autohide"] != "no") ? "autohide" : "") + '" data-role="editor-toolbar" data-target="' + id + '" style="' + userOptions["style"] + '">\n';

	if (userOptions["font"] != "no") {
		
	if (userOptions["sfont"] != "yes") {
	toolbar += "" + 
'<div class="btn-group">\n' + 
'	<a class="btn btn-default dropdown-toggle" data-toggle="dropdown" title="Font" data-original-title="Font"><b><i class="icon-font"></i></b><b class="icon-caret-down"></b></a>\n' + 
'	<ul class="dropdown-menu"><li></li></ul>\n' + 
'</div>\n' + 
'<div class="btn-group" style="margin-left: 0px;">\n' + 
'<a class="btn btn-default dropdown-toggle" data-toggle="dropdown" title="" data-original-title="Font Size"><b><i class="icon-text-width"></i></b><b class="icon-caret-down"></b></a>\n' + 
'<ul class="dropdown-menu">\n' + 
'	<li><a data-edit="fontSize 1"><font size="1">Very small</font></a></li>\n' + 
'	<li><a data-edit="fontSize 2"><font size="2">A bit small</font></a></li>\n' + 
'	<li><a data-edit="fontSize 3"><font size="3">Normal</font></a></li>\n' + 
'	<li><a data-edit="fontSize 4"><font size="4">Medium-large</font></a></li>\n' + 
'	<li><a data-edit="fontSize 5"><font size="5">Big</font></a></li>\n' + 
'	<li><a data-edit="fontSize 6"><font size="6">Very big</font></a></li>\n' + 
'	<li><a data-edit="fontSize 7"><font size="7">Maximum</font></a></li>\n' + 
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
'	<li> \n' + 
'	<div class="btn-group btn-group-xs"><a class="btn hide" ></a>\n';
		for (var i in userOptions["icons"]) {
			toolbar += '<a class="btn btn-default" data-edit="insertimage ' + userOptions["icons"][i] + '"><img src="' + userOptions["icons"][i] + '"></a>\n';
		}
		toolbar += '	</div></li></ul>\n</div>\n\n';
	}
	
	if (userOptions["img"] != "no") {
		sqno++;
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
	if (userOptions["bottom"] == "yes") {
		$(toolbar).insertAfter(id);
	} else {
		$(toolbar).insertBefore(id);
	}
/*
* 宋体	SimSun	\5B8B\4F53
* 黑体	SimHei	\9ED1\4F53
* 微软雅黑	Microsoft YaHei	\5FAE\8F6F\96C5\9ED1
* 华文细黑	STHeiti Light [STXihei]	\534E\6587\7EC6\9ED1
* 华文黑体	STHeiti	\534E\6587\9ED1\4F53
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
			htmFore += '	<li> \n	<div class="">\n';
		}
		htmFore += '	<a class="color-box" data-edit="ForeColor ' + color["color"] + '" style="background-color: ' + color["color"] + ';' + color["style"] + '" title="' + color["title"] + '">' + color["title"].charAt(0) + '</a>\n';
		
		total++;
		if (total == 8) {
			htmFore += '	</div></li>\n';
			total = 0;
		}
	});
	if (total != 0) {
		htmFore += '	</div></li>\n';
	}
	htmBack = htmFore.replace(/ForeColor/g, "BackColor") + '	<li>\n' + 
				'	<div class="btn-group">\n' + 
				'	<a class="color-box" data-edit="BackColor transparent" style="background-color: transparent;margin-left:200px;" title="No Color">X</a>\n' + 
				'	</div>\n' + 
				'	</li>\n';
  $(tbar).find('.fore-color').each(function() { $(this).append($(htmFore)); });
  $(tbar).find('.Back-Color').each(function() { $(this).append($(htmBack)); });

  $(tbar).find('a[title]').tooltip({container:'body'});
  $(tbar).find('.dropdown-menu input').click(function() {return false;}).change(function () {$(this).parent('.dropdown-menu').siblings('.dropdown-toggle').dropdown('toggle');}).keydown('esc', function () {this.value='';$(this).change();});

  $(tbar).find('[data-role=magic-overlay]').each(function () { 
	var overlay = $(this), target = $(overlay.data('target')); 
	overlay.css('opacity', 0).css('position', 'absolute').offset(target.offset()).width(target.outerWidth()).height(target.outerHeight());
  });
};

	$.fn.richtextbar = function (userOptions) {
		var self = this;
		var selector = $(self).attr("id") ? "#" + $(self).attr("id") : $(self).attr("target-obj");
		initBar(selector, userOptions);
		if (userOptions["baronly"] != "yes") {
			$(self).toolbar(userOptions);
		}
		return this;
	};
	
	function showRichTextError(zone, reason, detail) {
		var msg='';
		if (reason==='unsupported-file-type') { 
			reason = "Unsupported format";
		} else {
			console.log("error uploading file", reason, detail);
		}
		msg = '<strong>Reason:</strong>&nbsp;' + reason + '&nbsp;&nbsp;<strong>Detail:</strong>&nbsp;' + detail ;
		msg = '<div class="alert alert-danger alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' + msg + '</div>';
		zone.find(".alert-message").html(msg);
	};
}(window.jQuery));

var guard_keys = {};
function guard(key, within) {
	if (!key) return false;
	if (!within) within = 100;
	var lst = guard_keys[key] ? guard_keys[key] : 0;
	guard_keys[key] = new Date() - 0;
	return (lst + within > guard_keys[key]);
};

function selection(target) {
	var editor = target || $(this);
	
	this.get = function () {
		var sel = window.getSelection();
		if (sel.getRangeAt && sel.rangeCount) {
			return sel.getRangeAt(0);
		}
	};
	this.save = function () { editor.data("selection", get()); };
	this.restore = function () {
		var sel = window.getSelection();
		if (editor.data("selection")) {
			try {
				sel.removeAllRanges();
				sel.addRange(editor.data("selection"));
			} catch (ex) {
				document.body.createTextRange().select();
				document.selection.empty();
			}
		}
	};
	this.mark = function (input, color) {
		restore();
		if (document.queryCommandSupported('hiliteColor')) {
			document.execCommand('hiliteColor', 0, color || editor.data("selection-color") || 'transparent');
		}
		editor.data("selection-color", color);
	};
	return this;
}

String.prototype.toJSON = function() {
	try {
		if (!this.startsWith("{")) {
			return eval("({"+ this +"})"); 
		} else {
			return eval("("+ this +")"); 
		}
	} catch (msg) {
		return {};
	}
}