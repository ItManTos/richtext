![itmanTos](favicon.ico) Html5 Rich Text
===================
Tiny Html5 rich text editor based on bootstrap3 and jQuery, makes it easy to enable switch your input/textarea element into simple WYSIWYG editors.

Demo
-----------
See http://itmanTos.github.io/richtext/

Usage
-----------
* Rich Text without tool bar
``` javascript
 // Add divinput as class of input to enable it accept rich text.
<input type='text' class="divinput" name='simpleinput' value='' placeholder="A sample for rich text without tool bar, try drop/copy colourful text to here">
``` 
* Rich Text in one line
``` javascript
 // Add richtext as class of input to enable it accept rich text.
<input type='text' class="richtext form-control" name='richtl' value='' > 
``` 
* Rich Text
``` javascript
 // Add richtext as class of textarea to enable it accept rich text.
  <textarea class='richtext' name='richt' cols=100 rows=4 title="A sample for simple rich text"> </textarea>
``` 
* Rich Text in line with source code
``` javascript
 // Add richtextcode as class of input to enable it accept rich text.
 <input type='text' class="richtextcode col-md-12" name='richtcl' value='' placeholder="A sample for simple rich input ">
``` 
* Rich Text with source code
``` javascript
 // Add richtextcode as class of textarea to enable it accept rich text.
<textarea class='richtext' name='richt' cols=100 rows=5 > </textarea>
``` 
* Rich Text in one line with source code
``` javascript
 // Add richtextcode as class of input to enable it accept rich text and could edit its raw data.
<input type='text' class="richtextcode col-md-12" name='richtcl' value='' placeholder="Click 'code' at top-right to see text source code ">
``` 
	
* Rich Text with source code
``` javascript
 // Add richtextcode as class of textarea to enable it accept rich text and could edit its raw data.
<textarea class='richtextcode col-md-12' name='richtc' cols=100 rows=6 title="Click 'code' at top-right to see text source code"> </textarea>
``` 	

* Rich Text with source code
``` javascript
 // Add <code>divinputs</code> as class of <code>div</code> and specified its targets by <code>rt-selector</code> to provide a common tool bar for all rich text inputs.
<div class='divinputs' rt-selector='.issue_item' id='issue-zone'>
  <div class="form-group"><label for="i_title">Title</label><input type='text' class="divinput issue_item" id='i_title' value='' placeholder="a title for issue"></div>
  <div class="form-group"><label for="i_description">Description</label><textarea class="divinput issue_item" id='i_description' cols=100 rows=6 value='' placeholder="detail description for issue"></textarea></div>
</div></div>
``` 
	
* Hotkeys for Rich Text
```  
Following hotkeys could be used in any rich text box even there is no such button in tool bar:
	'ctrl+b': 'bold',
	'ctrl+i': 'italic',
	'ctrl+u': 'underline',
	'ctrl+z': 'undo',
	'ctrl+y': 'redo',
	'ctrl+l': 'justify left',
	'ctrl+r': 'justify right',
	'ctrl+e': 'justify center',
	'ctrl+j': 'justify full',
	'shift+tab': 'outdent',
	'tab': 'indent'
``` 
* Options for rich text bar
To use icons, initial richTextOptions in html with local icons like following:

``` javascript
	richTextOptions = {"icons": ["img/b1.png", "img/b2.png", "img/b3.png", "img/b4.png"]};
``` 

To always show tool bar, richTextOptions["autohide"] = "no" in html or like following:
``` javascript
	richTextOptions = {"autohide": "no"};
``` 

To hide buttons in tool bar for all rich text, change following:
``` javascript
	richTextOptions["font"] = "no";  //  hide following buttons from font to font color
	richTextOptions["sfont"] = "yes"; // hide font, font color, font size, only show simple font style, including: B I U S
	richTextOptions["p"] = "no";  // hide following buttons from indent to justify
	richTextOptions["link"] = "no";  // hide following buttons: link, unlink 
	richTextOptions["img"] = "no";  // hide following button:  img
	richTextOptions["undo"] = "no"; // hide following buttons: undo, redo
	richTextOptions["clear"] = "no"; // hide following button: X
``` 
	
* JS/CSS files required
``` javascript 
    <link rel='stylesheet' href='./css/bootstrap.min.css' />
    <link rel="stylesheet" href="./css/bootstrap-theme.min.css">
    <link rel='stylesheet' href='./css/font-awesome.min.css' />
    <!--[if IE 7]>
    <link rel="stylesheet" href="./css/font-awesome-ie7.min.css">
    <![endif]-->
    
    <link rel='stylesheet' href='./css/style.css' />
    <script src="./js/jquery.js"></script>
    <script src="./js/jquery.hotkeys.js"></script>
    <script src="./js/bootstrap.min.js"></script>
    <script src="./js/richtext.js"></script>
``` 
Dependencies
------------
* jQuery http://jquery.com/
* jQuery HotKeys https://github.com/jeresig/jquery.hotkeys
* Bootstrap http://twitter.github.com/bootstrap/
* Font Awesome http://fontawesome.io
