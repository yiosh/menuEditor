$(document).ready(function() {
  var imageList = [];
  const devMode = false;
  if (devMode) {
    console.log("pathname", window.location.pathname);
    console.log("location", window.location);
  }
  $.ajax({
    type: "GET",
    url: "fetchImages.php",
    data: {
      'host': window.location.host
    },
    success: (result) => {
      const data = JSON.parse(result);
      data.forEach(image => {
        let title = image.replace("../../fl_config/"+window.location.host+"/img/", "");
        let imageObject = {
          title: title,
          value: image
        }
        imageList.push(imageObject);
      })
      if (devMode) {
        console.log('Images Fetched:',data);
      }
    }
  });

  if (devMode) {
    console.log("Ready");
  }
  let currentpage = 0;
  let pageCountMax = 0;
  let templateSelected;
  let myURL = window.location.href;
  let url = new URL(myURL);
  const contentId = url.searchParams.get("content_id");
  const templateId = url.searchParams.get("template_id");
  const menuId = url.searchParams.get("menu_id");
  const parentId = menuId;
  const workflowId = 0;
  const mergePlaceholder = url.searchParams.get("merge_placeholder");
  let editorContent;
  let marginValue;
  let templateExists = [];

  function tinyMCE(height) {
    tinymce.init({
      selector: ".myeditablediv",
      plugins: ["image", "lists", "textcolor", "code"],
      image_list: imageList,
      height: height,
      inline: true,
      language: "it",
      content_css: '../css/content.css',
      font_formats:
        "Arial=Arial, Helvetica, sans-serif;" +
        "Andale Mono=andale mono,times;" +
        "Arial Black=arial black,avant garde;" +
        "Arimo=Arimo;" +
        "Book Antiqua=book antiqua,palatino;" +
        "Cinzel=Cinzel, serif;" +
        "Comic Sans MS=comic sans ms,sans-serif;" +
        "Cormorant Garamond=Cormorant Garamond, serif;" +
        "Courier New=courier new,courier;" +
        "Georgia=georgia,palatino;" +
        "Helvetica=helvetica;" +
        "Impact=impact,chicago;" +
        "Libre Baskerville=Libre Baskerville, serif;" +
        "Lora=Lora, serif;" +
        "Open Sans Condensed=Open Sans Condensed, sans-serif;" +
        "Oswald=Oswald, sans-serif;" +
        "Oxygen=Oxygen, sans-serif;" +
        "Playfair Display SC=Playfair Display SC, serif;" +
        "Roboto=Roboto, sans-serif;" +
        "Symbol=symbol;" +
        "Tahoma=tahoma,arial,helvetica,sans-serif;" +
        "Terminal=terminal,monaco;" +
        "Times New Roman=times new roman,times;" +
        "Trebuchet MS=trebuchet ms,geneva;" +
        "Ubuntu=Ubuntu, sans-serif;" +
        "Verdana=verdana,geneva;",
      // fontsize_formats: "8pt 10pt 12pt 14pt 18pt 24pt 36pt",
      style_formats: [
        { title: '5px Margin', inline: 'span', styles: {'margin': '5px 0px', display: 'block'} },
        { title: '10px Margin', inline: 'span', styles: {'margin': '10px 0px', display: 'block'} }
      ],
      menu : {
        file   : {title : 'File'  , items : 'newdocument'},
        edit   : {title : 'Edit'  , items : 'undo redo | cut copy paste pastetext | selectall'},
        insert : {title : 'Insert', items : 'link media mybutton image | template hr'},
        view   : {title : 'View'  , items : 'visualaid'},
        format : {title : 'Format', items : 'formats | bold italic underline strikethrough superscript subscript | removeformat'},
        table  : {title : 'Table' , items : 'inserttable tableprops deletetable | cell row column'},
        tools  : {title : 'Tools' , items : ' spellchecker code'}
      },
      // menubar: 'file edit insert view format table tools help',
      menubar: 'file edit insert view format formattazioni tools',

      toolbar:
        "fontselect fontsizeselect formatselect | forecolor backcolor | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | numlist bullist | code | removeformat",
      file_picker_types: "image",
      file_picker_callback: function(cb, value, meta) {
        var input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.onchange = function() {
          var file = this.files[0];
          var reader = new FileReader();
          reader.onload = function() {
            var id = "blobid" + new Date().getTime();
            var blobCache = tinymce.activeEditor.editorUpload.blobCache;
            var base64 = reader.result.split(",")[1];
            var blobInfo = blobCache.create(id, file, base64);
            blobCache.add(blobInfo);
            cb(blobInfo.blobUri(), { title: file.name });
          };
          reader.readAsDataURL(file);
        };
        input.click();
      },
      setup: function(editor) {
        editor.on("init", function(ed) {
          editor.execCommand("fontName", false, "Cinzel");
          // editor.execCommand("fontsize", false, "8pt");
        });
        let newArray = [];
        if (contentId || menuId) { 
          $.ajax({
            type: "GET",
            url: "load_editor_content.php",
            data: { 
              content_id: contentId,
              menu_id: menuId
             },
            success: function(result) {
              if (result) {
                const data = JSON.parse(result);
                editorContent = data;
                if (devMode) {
                  console.log('editorContent', editorContent)
                }
    
                $.each(data, function(index, value) {
                  newArray.push({
                    text: value.content_name,
                    onclick: function() {
                      editor.insertContent(value.editor_content);
                    }
                  });
                });
              }
            }
          });
        }
        editor.addMenuItem("mybutton", {
          text: "Contenuto",
          context: 'insert',
          menu: newArray,
          icon: false,
          onselect: function(e) {
            editor.insertContent(this.value());
          }
        });
      }
    });
  }

  // Check if template already exists, if so load it
  if (templateId > 0) {
    $.ajax({
      type: "POST",
      url: "template_check.php",
      data: { template_id: templateId },
      success: function(result) {
        // console.log('result',result);
        if (result !== "No match") {
          const resultParsed = JSON.parse(result);
          if (devMode) {
            console.log('resultParsed',resultParsed);
          }
          if (resultParsed.template_orientation == "Hor" || resultParsed.template_orientation == "Ver") {
            templateSelected = resultParsed.template_orientation;
            const wrapperClass = templateSelected == "Hor" ? "wrapper-h" : "wrapper-v";
            $("#template").hide();
            $("#container").show();
            $("#wrapper").addClass(wrapperClass);
            createNewPages(
              resultParsed.template_pages,
              resultParsed.template_orientation,
              0
            );
            $("#prev").show();
            $("#previous").prop("disabled", false);
            $.ajax({
              type: "POST",
              url: "template_content_load.php",
              data: { template_id: templateId },
              success: function(result) {
                if (result != "No match") {
                  const contentParsed = JSON.parse(result);
                  
                  $.each(contentParsed, function(index, array) {
                    if (mergePlaceholder === '1') {
                      array.forEach((content, arrIndex) => {
                        let replacedStr = content.replace(eContent.content_name, eContent.editor_content);
                        array[arrIndex] = replacedStr;
                      });
                      $("#editor" + [index + 1]).html(array);
                    } else {
                      $("#editor" + [index + 1]).html(array);
                    }                    
                  });
                } else {
                  console.log("Error loading content: ", result);
                }
              }
            });
          }
          if (resultParsed.template_orientation == "Hor2" || resultParsed.template_orientation == "Ver2") {
            templateSelected = resultParsed.template_orientation;
            const wrapperClass = templateSelected == "Hor2" ? "wrapper-h" : "wrapper-v";
            $("#template").hide();
            $("#container").show();
            $("#wrapper").addClass(wrapperClass);
            createNewPages(
              resultParsed.template_pages,
              resultParsed.template_orientation,
              0
            );
            $("#prev").show();
            $("#previous").prop("disabled", false);
            $.ajax({
              type: "POST",
              url: "template_content_load.php",
              data: { template_id: templateId },
              success: function(result) {
                if (result != "No match") {
                  const contentParsed = JSON.parse(result);
                  if (mergePlaceholder === '1') { 
                    contentParsed.forEach((array, index) => {
                      editorContent.forEach((eContent, eIndex) => {
                        array.forEach((content, arrIndex) => {
                          let replacedStr = content.replace(eContent.content_name, eContent.editor_content);
                          array[arrIndex] = replacedStr;
                        });
                      });
                      $("#editor" + [index + 1] + "-1").html(array[0]);
                      $("#editor" + [index + 1] + "-2").html(array[1]);
                    });
                  } else {
                    $.each(contentParsed, function(index, array) {
                      $("#editor" + [index + 1] + "-1").html(array[0]);
                      $("#editor" + [index + 1] + "-2").html(array[1]);
                    });
                  }
                  if (devMode) {
                    console.log("Content loaded: ", contentParsed);
                  }
                } else {
                  console.log("Error loading content: ", result);
                }
              }
            });
          }

          if (resultParsed.template_orientation == "Hor3") {
            templateSelected = "Hor3";
            $("#template").hide();
            $("#container").show();
            $("#wrapper").addClass("wrapper-h");
            createNewPages(
              resultParsed.template_pages,
              resultParsed.template_orientation,
              0
            );
            $("#prev").show();
            $("#previous").prop("disabled", false);
            $.ajax({
              type: "POST",
              url: "template_content_load.php",
              data: { template_id: templateId },
              success: function(result) {
                if (result != "No match") {
                  const contentParsed = JSON.parse(result);

                  if (mergePlaceholder === '1') { 
                    $.each(contentParsed, function(index, array) {
                      editorContent.forEach((eContent, eIndex) => {
                        array.forEach((content, arrIndex) => {
                          console.log(content);
                          let replacedStr = content.replace(eContent.content_name, eContent.editor_content);
                          array[arrIndex] = replacedStr;
                        });
                      });
                      $("#editor" + [index + 1] + "-1").html(array[0]);
                      $("#editor" + [index + 1] + "-2").html(array[1]);
                      $("#editor" + [index + 1] + "-3").html(array[2]);
                    });
                  } else {
                    $.each(contentParsed, function(index, array) {
                      $("#editor" + [index + 1] + "-1").html(array[0]);
                      $("#editor" + [index + 1] + "-2").html(array[1]);
                      $("#editor" + [index + 1] + "-3").html(array[2]);
                    });
                  }
                } else {
                  console.log("Error loading content: ", result);
                }
              }
            });
          }
        } else {
          if (devMode) {
            console.log(result);
          }
        }
      }
    });
  } else {
    $("#template").css('display', 'flex');
    $("#page-form").css('display', 'flex');
    $("#page-form-items").css('display', 'flex');
  }

  

  // Selected a template for the editor layout
  $(".template-list").click(function(e) {
    if (menuId) {
      templateSelected = e.target.id;
      function switchToTemplate(classToAdd, templateSelected) {
        $("#template").hide();
        $("#wrapper").addClass(classToAdd);
        $("#page-form").show();

        if (devMode) {
          console.log('templateSelected',templateSelected);
        }
      }

      switch (templateSelected) {
        case "Hor":
          switchToTemplate("wrapper-h", templateSelected);
          break;
        case "Ver":
          switchToTemplate("wrapper-v", templateSelected);
          break;
        case "Hor2":
          switchToTemplate("wrapper-h", templateSelected);
          break;
        case "Hor3":
          switchToTemplate("wrapper-h", templateSelected);
          break;
        case "Ver2":
          switchToTemplate("wrapper-v", templateSelected);
          break;
      }
    } else {
      alert('Per favore inserisci un menu_id');
    }
  });

  // Hide previous button if on the first page of the editor
  if (currentpage == 1) {
    $("#prev").hide();
    $("#previous").prop("disabled", true);
  }

  // Create new pages based on the templated selected
  function createNewPages(number, templateSelected, add) {
    $("#prev").show();
    $("#previous").prop("disabled", false);
    $("#nxt").hide();
    $("#next").prop("disabled", true);

    // If template selected is Hor or Ver create a new page with the corresponding layout
    if (templateSelected == "Hor" || templateSelected == "Ver") {
      const btnContainerClass = templateSelected === 'Hor' ? 'buttons-container-h' : 'buttons-container-v';
      const liEditorClass = templateSelected === 'Hor' ? 'editor-h' : 'editor-v';
      const myEditableDivClass = templateSelected === 'Hor' ? 'myeditablediv-h' : 'myeditablediv-v'
      const tinyMCEHeight = templateSelected === 'Hor' ? 595 : 842;

      $("#buttons-container").addClass(btnContainerClass);
      $("#wrapper").addClass("dark");
      for (let i = 0; i < number; i++) {
        if (add == 1) {
          currentpage = pageCountMax + 1;
        }

        if (currentpage <= 1) {
          $("#prev").hide();
          $("#previous").prop("disabled", true);
        }

        if (add == 0) {
          currentpage++;
        }

        let editorClass
        $("#editor-container").append(`
          <li id="e${currentpage}" class="editor ${liEditorClass}">
            <div class="col">
              <form method="post">
                <div id="editor${currentpage}" class="myeditablediv ${myEditableDivClass}">
                
                </div>
              </form>
            </div>
          </li>
        `);
        pageCountMax++;
      }
      $(`ul#editor-container .editor:not(${"#e" + currentpage})`).hide();
      tinyMCE(tinyMCEHeight);
      $("#page-counter").val(`${pageCountMax}/${pageCountMax}`);   
    }

    // If template selected is Hor2 or Ver2 create a new page with the corresponding layout
    if (templateSelected == "Hor2" || templateSelected == "Ver2") {
      const btnContainerClass = templateSelected === 'Hor2' ? 'buttons-container-h' : 'buttons-container-v';
      const liEditorClass = templateSelected === 'Hor2' ? 'editor-h2' : 'editor-v2';
      const myEditableDivClass = templateSelected === 'Hor2' ? 'myeditablediv-h' : 'myeditablediv-v'
      const tinyMCEHeight = templateSelected === 'Hor2' ? 595 : 842;

      $("#buttons-container").addClass(btnContainerClass);
      $("#wrapper").addClass("dark");
      for (let i = 0; i < number; i++) {
        if (add == 1) {
          currentpage = pageCountMax + 1;
        }

        if (currentpage <= 1) {
          $("#prev").hide();
          $("#previous").prop("disabled", true);
        }

        if (add == 0) {
          currentpage++;
        }
        $("#editor-container").append(`
          <li id="e${currentpage}" class="editor ${liEditorClass}">
            <div class="col">
              <form method="post">
                <div id="editor${currentpage}-1" class="myeditablediv ${myEditableDivClass}">

                </div>
              </form>
            </div>
  
            <div class="col">
              <form method="post">
                <div id="editor${currentpage}-2" class="myeditablediv ${myEditableDivClass}">

                </div>
              </form>
            </div>
          </li>
        `);
        pageCountMax++;
      }
      $(`ul#editor-container .editor:not(${"#e" + currentpage})`).hide();
      tinyMCE(tinyMCEHeight);
      $("#page-counter").val(`${pageCountMax}/${pageCountMax}`);
    }

    // If template selected is Hor3 create a new page with the corresponding layout
    if (templateSelected == "Hor3") {
      $("#buttons-container").addClass("buttons-container-h");
      $("#wrapper").addClass("dark");
      for (let i = 0; i < number; i++) {
        if (add == 1) {
          currentpage = pageCountMax + 1;
        }

        if (currentpage <= 1) {
          $("#prev").hide();
          $("#previous").prop("disabled", true);
        }

        if (add == 0) {
          currentpage++;
        }
        $("#editor-container").append(`
          <li id="e${currentpage}" class="editor editor-h3">
            <div class="col">
              <form method="post">
                <div id="editor${currentpage}-1" class="myeditablediv myeditablediv-h">

                </div>
              </form>
            </div>
  
            <div class="col">
              <form method="post">
                <div id="editor${currentpage}-2" class="myeditablediv myeditablediv-h">

                </div>
              </form>
            </div>

            <div class="col">
              <form method="post">
                <div id="editor${currentpage}-3" class="myeditablediv myeditablediv-h">

                </div>
              </form>
            </div>
          </li>
        `);
        pageCountMax++;
      }

      $(`ul#editor-container .editor:not(${"#e" + currentpage})`).hide();
      tinyMCE(595);
      $("#page-counter").val(`${pageCountMax}/${pageCountMax}`);
    }
  }

  $("#submit").click(function() {
    let numberofPages = $("#pageNumber").val();
    $("#page-form").hide();
    createNewPages(numberofPages, templateSelected, 0);
    $("#pageNumber").val("");
    $("#container").show();
  });

  $("#new-page").click(function() {
    createNewPages(1, templateSelected, 1);
  });

  $("#previous").click(function() {
    if (currentpage > 1) {
      currentpage--;
    }
    if (currentpage == 1) {
      $("#prev").hide();
      $("#previous").prop("disabled", true);

      $("#e1").show();
    }
    $("#nxt").show();
    $("#next").prop("disabled", false);
    $(`ul#editor-container .editor:not(${"#e" + currentpage})`).hide();
    $(`${"#e" + currentpage}`).show();
    $("#page-counter").val(`${currentpage}/${pageCountMax}`);
  });

  $("#next").click(function() {
    if (currentpage < pageCountMax) {
      currentpage++;
    }
    $("#prev").show();
    $("#previous").prop("disabled", false);
    if (currentpage == pageCountMax) {
      $("#nxt").hide();
      $("#next").prop("disabled", true);
    }
    $(`ul#editor-container .editor:not(${"#e" + currentpage})`).hide();
    $(`${"#e" + currentpage}`).show();
    $("#page-counter").val(`${currentpage}/${pageCountMax}`);
  });

  $("#page-form").hide();
  $("#container").hide();

  // Print content
  $("#print").click(function() {
    $("#print-here").show();
    $("ul#editor-container li").show();

    const printDiv = document.getElementById("print-here");

    // If template selected was Hor or Ver fetch the data from all editors and create a new container to print in
    if (templateSelected == "Hor" || templateSelected == "Ver") {
      for (let pageIndex = 1; pageIndex <= pageCountMax; pageIndex++) {
        let page = document.createElement("div");
        page.classList.add("page");
        let editor = document.createElement("div");
        editor.classList.add("editor");
        editor.classList.add('myeditablediv');
        editor.innerHTML = tinymce.get(`editor${pageIndex}`).getContent();
        page.appendChild(editor);
        printDiv.appendChild(page);
      }
    }

    // If template selected was Hor2 or Ver2 fetch the data from all editors and create a new container to print in
    if (templateSelected == "Hor2" || templateSelected == "Ver2") {
      for (let pageIndex = 1; pageIndex <= pageCountMax; pageIndex++) {
        let page = document.createElement("div");
        page.classList.add("page");
        let editorContainer = document.createElement("div");
        editorContainer.classList.add(templateSelected == 'Hor2' ? 'editor-h2' : 'editor-v2');
        const numberOfEditors = 2;

        for (let editorIndex = 1; editorIndex <= numberOfEditors; editorIndex++) {
          let editor = document.createElement("div");
          editor.classList.add("editor");
          editor.classList.add('myeditablediv');

          editor.innerHTML = tinymce.get(`editor${pageIndex}-${editorIndex}`).getContent();
          editorContainer.appendChild(editor);
        }
        page.appendChild(editorContainer);
        printDiv.appendChild(page);
      };
    }

    // If template selected was Hor3 fetch the data from all editors and create a new container to print in
    if (templateSelected == "Hor3") {
      for (let pageIndex = 1; pageIndex <= pageCountMax; pageIndex++) {
        let page = document.createElement("div");
        page.classList.add("page");
        let editorContainer = document.createElement("div");
        editorContainer.classList.add('editor-h3');
        const numberOfEditors = 3;

        for (let editorIndex = 1; editorIndex <= numberOfEditors; editorIndex++) {
          let editor = document.createElement("div");
          editor.classList.add("editor");
          editorContainer.classList.add('myeditablediv');

          editor.innerHTML = tinymce.get(`editor${pageIndex}-${editorIndex}`).getContent();
          editorContainer.appendChild(editor);
        }
        page.appendChild(editorContainer);
        printDiv.appendChild(page);
      };
    }

    // Hide layout from printing (buttons, background, etc)
    $("#wrapper").hide();
    
    window.print(); //Print Page
    printDiv.innerHTML = ""; //Reset the page's HTML with div's HTML only
    $("#print-here").hide();
    $("#wrapper").show();

    $(`ul#editor-container .editor:not(${"#e" + currentpage})`).hide(); // Hide the pages that are not current
  });

  // When save is clicked
  $("#save").click(function() {
    // If a template was loaded update it
    if (templateId > 0 && mergePlaceholder === '1') {

      if (templateSelected == "Hor" || templateSelected == "Ver") {
        console.log($(".editor").length);
        const editorLength = $(".editor").length;
        let data = [];
        for (let index = 0; index < editorLength; index++) {
          data.push($("#editor" + [index + 1])[0].innerHTML);
        }
        let templateName = prompt("Nome dil template:");

        $.ajax({
          type: "POST",
          url: "save_content.php",
          data: {
            template_id: templateId,
            workflow_id: workflowId,
            parent_id: parentId,
            template_name: templateName,
            template_orientation: templateSelected,
            template_pages: pageCountMax,
            template_content: data,
            operatore: "Aryma"
          },
          success: function(result) {
            toastr.success(`Menù "${templateName}" salvato`, "Successo", {
              timeOut: 5000
            });
          }
        });
      } else if (templateSelected == "Hor2" || templateSelected == "Ver2") {
        const editorLength = $(".editor").length;
        let data = [];
        for (let index = 0; index < editorLength; index++) {
          let editorsData = [];
          editorsData.push($("#editor" + [index + 1] + "-1")[0].innerHTML);
          editorsData.push($("#editor" + [index + 1] + "-2")[0].innerHTML);
          data.push(editorsData);
        }
        let templateName = prompt("Nome dil template:");

        $.ajax({
          type: "POST",
          url: "save_content.php",
          data: {
            template_id: templateId,
            workflow_id: workflowId,
            parent_id: parentId,
            template_name: templateName,
            template_orientation: templateSelected,
            template_pages: pageCountMax,
            template_content: data,
            operatore: "Aryma"
          },
          success: function(result) {
            toastr.success(`Menù "${templateName}" salvato`, "Successo", {
              timeOut: 5000
            });
          }
        });
      } else if (templateSelected == "Hor3") {
        const editorLength = $(".editor").length;
        let data = [];
        for (let index = 0; index < editorLength; index++) {
          let editorsData = [];
          editorsData.push($("#editor" + [index + 1] + "-1")[0].innerHTML);
          editorsData.push($("#editor" + [index + 1] + "-2")[0].innerHTML);
          editorsData.push($("#editor" + [index + 1] + "-3")[0].innerHTML);
          data.push(editorsData);
        }
        let templateName = prompt("Nome dil template:");

        $.ajax({
          type: "POST",
          url: "save_content.php",
          data: {
            template_id: templateId,
            workflow_id: workflowId,
            parent_id: parentId,
            template_name: templateName,
            template_orientation: templateSelected,
            template_pages: pageCountMax,
            template_content: data,
            operatore: "Aryma"
          },
          success: function(result) {
            toastr.success(`Menù "${templateName}" salvato`, "Successo", {
              timeOut: 5000
            });
          }
        });
      }
	} else if (templateId > 0 && !mergePlaceholder ) {
		if (templateSelected == "Hor" || templateSelected == "Ver") {
		  const editorLength = $(".editor").length;
		  let data = [];
		  for (let index = 0; index < editorLength; index++) {
			data.push($("#editor" + [index + 1])[0].innerHTML);
		  }
		  let templateName = prompt("Nome del template:");
  
		  $.ajax({
			type: "POST",
			url: "template_update.php",
			data: {
			  template_id: templateId,
			  workflow_id: workflowId,
			  parent_id: parentId,
			  template_name: templateName,
			  template_orientation: templateSelected,
			  template_pages: pageCountMax,
			  template_content: data,
			  operatore: "Aryma"
			},
			success: function(result) {
			  toastr.success(`Menù "${templateName}" salvato`, "Successo", {
				timeOut: 5000
			  });
			}
		  });
		}
  
		if (templateSelected == "Hor2" || templateSelected == "Ver2") {
		  const editorLength = $(".editor").length;
		  let data = [];
		  for (let index = 0; index < editorLength; index++) {
			let editorsData = [];
			editorsData.push($("#editor" + [index + 1] + "-1")[0].innerHTML);
			editorsData.push($("#editor" + [index + 1] + "-2")[0].innerHTML);
			data.push(editorsData);
		  }
		  let templateName = prompt("Nome dil template:");
  
		  $.ajax({
			type: "POST",
			url: "template_update.php",
			data: {
			  template_id: templateId,
			  workflow_id: workflowId,
			  parent_id: parentId,
			  template_name: templateName,
			  template_orientation: templateSelected,
			  template_pages: pageCountMax,
			  template_content: data,
			  operatore: "Aryma"
			},
			success: function(result) {
			  toastr.success(`Menù "${templateName}" salvato`, "Successo", {
				timeOut: 5000
			  });
			}
		  });
		}
		if (templateSelected == "Hor3") {
		  const editorLength = $(".editor").length;
		  let data = [];
		  for (let index = 0; index < editorLength; index++) {
			let editorsData = [];
			editorsData.push($("#editor" + [index + 1] + "-1")[0].innerHTML);
			editorsData.push($("#editor" + [index + 1] + "-2")[0].innerHTML);
			editorsData.push($("#editor" + [index + 1] + "-3")[0].innerHTML);
			data.push(editorsData);
		  }
		  let templateName = prompt("Nome dil template:");

		  $.ajax({
			type: "POST",
			url: "template_update.php",
			data: {
			  template_id: templateId,
			  workflow_id: workflowId,
			  parent_id: parentId,
			  template_name: templateName,
			  template_orientation: templateSelected,
			  template_pages: pageCountMax,
			  template_content: data,
			  operatore: "Aryma"
			},
			success: function(result) {
			  toastr.success(`Menù "${templateName}" salvato`, "Successo", {
				timeOut: 5000
			  });
			}
		  });
		}
	} else {

      if (templateSelected == "Hor" || templateSelected == "Ver") {
        const editorLength = $(".editor").length;
        let data = [];
        for (let index = 0; index < editorLength; index++) {
          data.push($("#editor" + [index + 1])[0].innerHTML);

          // const element = array[index];
        }
        let templateName = prompt("Nome dil template:");

        $.ajax({
          type: "POST",
          url: "save_content.php",
          data: {
            template_id: templateId,
            workflow_id: workflowId,
            parent_id: parentId,
            template_name: templateName,
            template_orientation: templateSelected,
            template_pages: pageCountMax,
            template_content: data,
            operatore: "Aryma"
          },
          success: function(result) {
            toastr.success(`Menù "${templateName}" salvato`, "Successo", {
              timeOut: 5000
            });
          }
        });
      } else if (templateSelected == "Hor2" || templateSelected == "Ver2") {
        const editorLength = $(".editor").length;
        let data = [];
        for (let index = 0; index < editorLength; index++) {
          let editorsData = [];
          editorsData.push($("#editor" + [index + 1] + "-1")[0].innerHTML);
          editorsData.push($("#editor" + [index + 1] + "-2")[0].innerHTML);
          data.push(editorsData);
        }
        let templateName = prompt("Nome dil template:");

        $.ajax({
          type: "POST",
          url: "save_content.php",
          data: {
            template_id: templateId,
            workflow_id: workflowId,
            parent_id: parentId,
            template_name: templateName,
            template_orientation: templateSelected,
            template_pages: pageCountMax,
            template_content: data,
            operatore: "Aryma"
          },
          success: function(result) {
            toastr.success(`Menù "${templateName}" salvato`, "Successo", {
              timeOut: 5000
            });
          }
        });
      } else if (templateSelected == "Hor3") {
        const editorLength = $(".editor").length;
        let data = [];
        for (let index = 0; index < editorLength; index++) {
          let editorsData = [];
          editorsData.push($("#editor" + [index + 1] + "-1")[0].innerHTML);
          editorsData.push($("#editor" + [index + 1] + "-2")[0].innerHTML);
          editorsData.push($("#editor" + [index + 1] + "-3")[0].innerHTML);
          data.push(editorsData);
        }
        let templateName = prompt("Nome dil template:");

        $.ajax({
          type: "POST",
          url: "save_content.php",
          data: {
            template_id: templateId,
            workflow_id: workflowId,
            parent_id: parentId,
            template_name: templateName,
            template_orientation: templateSelected,
            template_pages: pageCountMax,
            template_content: data,
            operatore: "Aryma"
          },
          success: function(result) {
            toastr.success(`Menù "${templateName}" salvato`, "Successo", {
              timeOut: 5000
            });
          }
        });
      }
    }
  });

  $("#margin-setter").on("change", function (e) {
    // console.log("Params", e);
    marginValue = Number(e.target.value);
    $("head").append(`<style>.myeditablediv { padding: ${marginValue}mm !important;}</style>`);
    // $(".myeditablediv").css("padding", `${marginValue}mm`);
  });

});
