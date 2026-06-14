
    //Version 2.05   (Change in HTML)  
    //Edited Standard Views to accommodate Alternative Views:
    //  Only 1 language: Commented out language drop down menu

    //  For TE Standard Views, video = 390 x 350 px (389 x 350 in SV):
    //     sliderClip
    //     prepClipSlider
    //  For TTE Standard Views, 3d frames are = 389 x 349 px (389 x 350 in SV):

    //Parsing changed to extract folder names from XML in loadMasterXML

    //Fixed bug in prepClipSlider which prevented video from playing in Edge and Safari. Changes to:
    //  var viewsFolderName
    //  prepClipSlider

    //Added browserDetection() to pop-up an alert if the browser is IE and advise the user to use another browser

    //vars
    var sliderV = $("#sliderV").slider();
    var sliderH = $("#sliderH").slider();       
    var viewSliceMultiplier = 0; //toggle between 0 and 698
    var viewClipMultiplier = 350; //toggle between 0 and 350
    var rotatableView = true;//default is on
    var labelsDisplay = true;//default is on
    var ribsVisible = true; //default is visible
    var sliceVisible = false; //default is not visible
    
    var currentTwoAxisPosition = "";
    var currentTwoAxisImage = "";
    
    var sliderClip = $("#clipSlider").slider(); 
    var totalImagingFrames = 20; //this should be switched on changing views. total width / 390 = totalImagingFrames  
    var clipToggle; //use this for setInterval/clearInterval for play/pausing clip
    var clipIsPlaying = true;
    
    var viewsArray = [];
    var viewsFolderArray = [];
    var textColumnsArray = [];
    var currentViewIndex = 0;       //default as 0 = Apical_2C
    var viewsFolderName = "PS_LAX";
    var detailTextSelected = 1;     //Column of text to display
    var viewChangeRequestId = 0;
    var currentLanguage = "en";

    var interfaceText = {
        en: {
            pageTitle: "TTE HTML5 Standard Views",
            appTitle: "TTE: Standard Views",
            viewLabel: "View",
            languageLabel: "Language",
            detailsLabel: "Details",
            detailObtain: "How to Obtain this View",
            detailOptimize: "How to Optimize this View",
            detailAssess: "Use this View to Assess",
            detailIdentify: "Identify these Structures",
            footerVersion: "TTE: Standard views. Version 2.00",
            footerCopyright: "Content copyright © pie.med.utoronto.ca. All rights reserved.",
            viewRibsOn: "View Ribs on",
            viewRibsOff: "View Ribs off",
            viewSliceOn: "Show cutaway",
            viewSliceOff: "Hide cutaway",
            labelsOn: "Labels on",
            labelsOff: "Labels off",
            rotatableOn: "Rotate on",
            rotatableOff: "Rotate off",
            clipOverlayOn: "Hide",
            clipOverlayOff: "Show"
        },
        zh: {
            pageTitle: "经胸超声心动图 HTML5 标准切面",
            appTitle: "经胸超声心动图：标准切面",
            viewLabel: "切面",
            languageLabel: "语言",
            detailsLabel: "详情",
            detailObtain: "如何获取此切面",
            detailOptimize: "如何优化此切面",
            detailAssess: "使用此切面评估",
            detailIdentify: "识别这些结构",
            footerVersion: "经胸超声心动图：标准切面。版本 2.00",
            footerCopyright: "内容版权归 pie.med.utoronto.ca 所有。",
            viewRibsOn: "显示肋骨",
            viewRibsOff: "隐藏肋骨",
            viewSliceOn: "显示剖切",
            viewSliceOff: "隐藏剖切",
            labelsOn: "显示标注",
            labelsOff: "隐藏标注",
            rotatableOn: "旋转开启",
            rotatableOff: "旋转关闭",
            clipOverlayOn: "隐藏",
            clipOverlayOff: "显示"
        }
    };

    var viewNameTranslations = {
        "Parasternal Long Axis": "胸骨旁长轴",
        "Parasternal Long Axis Right Ventricular Inflow View": "胸骨旁长轴右室流入道切面",
        "Parasternal Long Axis Right Ventricular Outflow View": "胸骨旁长轴右室流出道切面",
        "Parasternal Short Axis Aortic Valve and Right Ventricular Outflow Tract Level": "胸骨旁短轴主动脉瓣及右室流出道水平",
        "Parasternal Short Axis Left Ventricle at Mitral Valve Level": "胸骨旁短轴左心室二尖瓣水平",
        "Parasternal Short Axis Left Ventricle at Mid Level": "胸骨旁短轴左心室中段水平",
        "Parasternal Short Axis Left Ventricle at Apex Level": "胸骨旁短轴左心室心尖水平",
        "Parasternal Pulmonary Artery Bifurcation View": "胸骨旁肺动脉分叉切面",
        "Apical Four Chamber": "心尖四腔心切面",
        "Apical Five Chamber (Elevated Four Chamber view)": "心尖五腔心切面（四腔心上抬）",
        "Apical Two Chamber (Vertical Long Axis view)": "心尖两腔心切面（垂直长轴）",
        "Apical Long Axis (Three Chamber view)": "心尖长轴切面（三腔心）",
        "Subcostal Four Chamber": "剑突下四腔心切面",
        "Subcostal Aortic Valve and Right Ventricular Outflow Tract": "剑突下主动脉瓣及右室流出道切面",
        "Subcostal Left Ventricle at Mitral Valve": "剑突下左心室二尖瓣水平",
        "Subcostal Left Ventricle at Mid": "剑突下左心室中段切面",
        "Subcostal Left Ventricle at Apex": "剑突下左心室心尖切面",
        "Subcostal Inferior Vena Cava": "剑突下下腔静脉切面",
        "Suprasternal Long Axis of Aortic Arch": "胸骨上窝主动脉弓长轴切面",
        "Right Parasternal Ascending Aorta": "右胸骨旁升主动脉切面"
    };

     //console.log("viewsFolderArray");   
     //console.log(viewsFolderArray);   
    //assigning functions to buttons/toggles/sliders
    
        
        
    sliderClip.on("change", function(sliderValue) 
        {
            var clipPos = (sliderValue.value.newValue)*(-390);
            var slicePos = (0 + viewClipMultiplier) + 'px'; //0 or 350
            var backgroundPos = clipPos + 'px ' + slicePos;
            $("#clipPlayer").css('backgroundPosition', backgroundPos);

        });    

        
    sliderV.on("change", function(sliderValue) 
        {
            var verticalPos = (sliderValue.value.newValue)*(-389);
            var slicePos = (1745 + viewSliceMultiplier) + 'px'; //349, 1047, 1745...
            var backgroundPos = verticalPos + 'px ' + slicePos;
            $("#heartModelTwoAxisSpin").css('backgroundPosition', backgroundPos);
        

            if (sliderV.slider('getValue') > 0 ||
               sliderV.slider('getValue') < 36)
                {
                    sliderH.slider('setValue', 0);
                }


        });
    
 
    sliderH.on("change", function(sliderValue) 
        {
            var horizontalPos = (sliderValue.value.newValue)*(-389);
            var slicePos = (0 + viewSliceMultiplier) + 'px'; //700, 1400, 2100...
            var backgroundPos = horizontalPos + 'px ' + slicePos;
            $("#heartModelTwoAxisSpin").css('backgroundPosition', backgroundPos);
        
            if (sliderH.slider('getValue') > 0 ||
               sliderH.slider('getValue') < 36)
                {
                    sliderV.slider('setValue', 0);
                }
        });
    
    $('#labelsToggle').change(function() {
      toggleLabels();
    })    
        

    $('#viewRibToggle').change(function() {
      toggleRibView();
    })

    $('#viewSliceToggle').change(function() {
      toggleSliceView();
    })
        
    $('#viewRotatableToggle').change(function() {
      toggleRotatableView();
    })
        
    $('#playPauseBtn').click(function() {
      toggleClipPlayPause();
        
    })
        
    $('#viewClipOverlay').change(function() {
      toggleClipOverlay();
    })

    $('#languageSelect').on('change', function(){
        setLanguage($(this).val());
    });
        
    //Select a view from the laft hand drop-down menu
    $('#viewSelect').on('change', function(){
        
        var viewIndex = ($('#viewSelect').val())
        var requestId = ++viewChangeRequestId;

        preloadViewAssets(viewIndex, function() {
            if (requestId !== viewChangeRequestId) {
                return;
            }

            applyViewChange(viewIndex);
        });
    });

    //Select a column of text to Details drop-down menu
    $('#detailSelect').on('change', function(){
        var detailIndex = ($('#detailSelect').val())
        
        detailTextSelected = detailIndex
        $("#detailText").html(getDetailText(currentViewIndex, detailTextSelected));
    });

        
    //first time run   
    browserDetection();
    prepClipSlider();
    //startPlayingClip();   
    setLanguage(getInitialLanguage());
    loadMasterXML('english');     //Load and parse the XML file.
    $('#labelsToggleDiv').toggle();
    togglePreloader();    
    
        
    //functions

    function browserDetection() {
        if((navigator.userAgent.indexOf("Opera") || navigator.userAgent.indexOf('OPR')) != -1 )
        {
            // alert('Opera');
        }
        else if(navigator.userAgent.indexOf("Chrome") != -1 )
        {
            // alert('Chrome');
        }
        else if(navigator.userAgent.indexOf("Safari") != -1)
        {
            // alert('Safari');
        }
        else if(navigator.userAgent.indexOf("Firefox") != -1 )
        {
            // alert('Firefox');
        }
        else if((navigator.userAgent.indexOf("MSIE") != -1 ) || (!!document.documentMode == true )) //IF IE > 10
        {
            alert('This website uses modern coding techniques that are not supported by Internet Explorer. Please use one of the following web browsers: Firefox, Chrome, Safari, Edge or Opera');
        }
        else if(navigator.userAgent.indexOf("rv:11.0") != -1 ) //IF IE 11
        {
            alert('This website uses modern coding techniques that are not supported by Internet Explorer. Please use one of the following web browsers: Firefox, Chrome, Safari, Edge or Opera');
        }
        else
        {
            // alert('unknown');
        }
    }

    function toggleRibView()
        {
            //in the TTE spritesheet, there are a total of 6 rows: 2 ribs, 2 closed and 2 sliced
            //top 2 rows are 'normal', bottom two show the slice.
            //For AV, each row runs at a 349px height, so to transverse from a 'normal' view to a 'slice' view, set the y-position to 0 or 1396
            if (ribsVisible == false)
                {
                    $('#viewSliceToggle').bootstrapToggle('off');  //Set View slice button to off
                    viewSliceMultiplier = 0;
                    ribsVisible = true;
                }
            else
                {
                    if (viewSliceMultiplier == 0)
                        {
                            viewSliceMultiplier = 1396;  //pixels from the top of the spritesheet to the top of the row to display
                            ribsVisible = false;
                            sliceVisible = false;
                        }
                    else{

                            viewSliceMultiplier = 0;
                            ribsVisible = true;
                        }
                }

            console.log("toggleRibView")
            console.log("viewSliceMultiplier for toggleRibView");
            console.log(viewSliceMultiplier);
            console.log("ribsVisible");
            console.log(ribsVisible);
            console.log("sliceVisible");
            console.log(sliceVisible);
            
            //resetting the slider positions to reflect the view slice option
            //basically saving the current slider position, setting it 0, and returning back
            
            var sliderVvalue = sliderV.slider('getValue');
            var sliderHvalue = sliderH.slider('getValue');
            

            sliderV.slider('setValue', 1);
            sliderH.slider('setValue', 1);
            
            sliderV.slider('setValue', sliderVvalue, true, true);
            sliderH.slider('setValue', sliderHvalue, true, true);
        }

    function toggleSliceView()
        {
            //in the spritesheet, there should be a total of 4 rows
            //top 2 rows are 'normal', bottom two show the slice.
            //For AV, each row runs at a 349px height, so to transverse from a 'normal' view to a 'slice' view, set the y-position to 0 or 698
            
            if (ribsVisible == true)
                {
                    $('#viewRibToggle').bootstrapToggle('off');  //Set View Ribs button to off.
                    viewSliceMultiplier = 698;  //pixels from the bottom of the spritesheet to the top of the row to display
                    sliceVisible = true;
                    ribsVisible = false;
                }
            else
                {
                    if (viewSliceMultiplier == 1396)
                        {
                            viewSliceMultiplier = 698;  //pixels from the bottom of the spritesheet to the top of the row to display
                            sliceVisible = true;
                            ribsVisible = false;
                        }
                    else{

                            viewSliceMultiplier = 1396;
                            sliceVisible = false;
                            ribsVisible = false;
                        }
                }
            
            console.log("toggleSliceView")
            console.log("viewSliceMultiplier for toggleSliceView");
            console.log(viewSliceMultiplier);
            console.log("ribsVisible");
            console.log(ribsVisible);
            console.log("sliceVisible");
            console.log(sliceVisible);
            
            //resetting the slider positions to reflect the view slice option
            //basically saving the current slider position, setting it 0, and returning back
            
            var sliderVvalue = sliderV.slider('getValue');
            var sliderHvalue = sliderH.slider('getValue');
            

            sliderV.slider('setValue', 1);
            sliderH.slider('setValue', 1);
            
            sliderV.slider('setValue', sliderVvalue, true, true);
            sliderH.slider('setValue', sliderHvalue, true, true);
        }
        
    function toggleRotatableView()
        {
            $('#labelsToggleDiv').toggle();
            $('#viewSliceToggleDiv').toggle();
            $('#viewRibToggleDiv').toggle();
            
            if (rotatableView == true)
                {
                    currentTwoAxisPosition = $("#heartModelTwoAxisSpin").css("background-position");
                    //currentTwoAxisImage = $("#heartModelTwoAxisSpin").css("background-image");
                    
                
                   var SVToDisplay = "url('images/" + viewsFolderArray[currentViewIndex] + "/SV.jpg')";
                   var SVLabelledToDisplay = "url('images/" + viewsFolderArray[currentViewIndex] + "/SV_labeled.jpg')";
                       
                   if (labelsDisplay == false)
                    {
                        $("#heartModelTwoAxisSpin").css('background-image', SVToDisplay);

                    }
                    else if (labelsDisplay == true)
                    {
                        $("#heartModelTwoAxisSpin").css('background-image', SVLabelledToDisplay);

                    }

                    
                    $("#heartModelTwoAxisSpin").css('background-position', "0 0");
                    
                    $("#sliderH").css('visibility','hidden');
                    $("#sliderV").css('visibility','hidden');
                    
                    rotatableView = false;
                }
            else if (rotatableView == false)
                {
                    
                    var twoAxisToDisplay = "url('images/" + viewsFolderArray[currentViewIndex] + "/spriteSheet_3d.jpg')";
                    
                    $("#heartModelTwoAxisSpin").css('background-image', twoAxisToDisplay);
                    $("#heartModelTwoAxisSpin").css('background-position', currentTwoAxisPosition);
                    
                    $("#sliderH").css('visibility','visible');
                    $("#sliderV").css('visibility','visible');
                    
                    rotatableView = true;
                }
            
            //console.log("End of toggleRotatableView");
            //console.log("currentTwoAxisPosition");
            //console.log(currentTwoAxisPosition);
        }
        
    function toggleLabels()
        {
            var SVToDisplay = "url('images/" + viewsFolderArray[currentViewIndex] + "/SV.jpg')";
            var SVLabelledToDisplay = "url('images/" + viewsFolderArray[currentViewIndex] + "/SV_labeled.jpg')";
            
            
            if (labelsDisplay == false)
                {
                    $("#heartModelTwoAxisSpin").css('background-image', SVLabelledToDisplay);
                    labelsDisplay = true;
                }
            else if (labelsDisplay == true)
                {
                    $("#heartModelTwoAxisSpin").css('background-image', SVToDisplay);
                    labelsDisplay = false;
                }
           
            //console.log("End of toggleLabels");
            
         }
        
    function toggleClipPlayPause()
        {
            if (clipIsPlaying == true)
                {
                    stopPlayingClip();
                    $("#playPauseBtn").html('<i class="fa fa-play"></i>');
                    clipIsPlaying = false;
                }
            else if (clipIsPlaying == false)
                {
                    startPlayingClip();
                    $("#playPauseBtn").html('<i class="fa fa-pause"></i>');
                    clipIsPlaying = true;
                }
           //console.log("End of toggleClipPlayPause"); 
        }
   
        
    function prepClipSlider()
        {
           
            //Fancy code to get new teeClip spritesheet total width since the spritesheet has a variable number of frames.
            var img = new Image;
            var urlPath = window.location.href;
            var positionOfIndex = urlPath.indexOf("index.html");
            img.src = urlPath.substring(0,positionOfIndex) + "images/" + viewsFolderName + "/spriteSheet_vid.jpg";
            
            img.onload = function() {
                totalImagingFrames = (img.naturalWidth)/390;  //For TTE Standard Views, the video images are 390 x 350 px
                sliderClip.slider('setAttribute', 'max', totalImagingFrames);
                toggleClipPlayPause();
                toggleClipPlayPause();

            };//stagger this to ensure the image is actually loaded before getting the width
            
            console.log("End of prepClipSlider"); 
            console.log("viewsFolderName");
            console.log(viewsFolderName);
        }
    
    function startPlayingClip()
        {
            
            var interval = 34; //30fps
            
            clipToggle = setInterval(
            
            function() 
            {
            var clipSliderPosition = sliderClip.slider('getValue');
                
                if (clipSliderPosition < totalImagingFrames)
                    {

                        sliderClip.slider('setValue', (clipSliderPosition+1), true, true);
                    }
                else
                    {
                        sliderClip.slider('setValue', 0, true, true);
                }
            
            }, interval);
            
            //console.log("End of startPlayingClip");
        }
        
    function stopPlayingClip()
        {
            clearInterval(clipToggle);
            
            //console.log("End of stopPlayingClip");
 
        }
        
    function toggleClipOverlay()
        {

            if (viewClipMultiplier == 0)
                {
                    viewClipMultiplier = 350;
                }
            else if (viewClipMultiplier == 350)
                {
                    viewClipMultiplier = 0;
                }
            
            var clipSliderPosition = sliderClip.slider('getValue');
            sliderClip.slider('setValue', 1, true, true);
            sliderClip.slider('setValue', clipSliderPosition, true, true);

            //console.log("End of toggleClipOverlay");
        }
    
    // Load local JS data first so the app also works when index.html is opened directly with file://.

    function loadMasterXML(language)
        {
            viewsArray.length = 0;
            viewsFolderArray.length = 0;
            textColumnsArray.length = 0;

            if (window.tteStandardViewsData)
                {
                    loadMasterRows(window.tteStandardViewsData);
                    finishMasterDataLoad();
                    return;
                }
            
            var xmlFileName = 'xml/TTE_Standard_Text_02.xml';
            
            $.ajax({
            url: xmlFileName,
            dataType: 'xml',
            success: function(data) {
                    
                $masterXML = $(data);
                $masterXML.find("row").each(function(i,j)
                {  
                   
                   var viewFolderSWF = $(j).attr("swf_spin")
                   //Parse the folder name for each view from the second line of the XML for each view.
                   var viewFolderName = viewFolderSWF.match("twoAxis-(.*).swf");     
                   viewsFolderArray.push(viewFolderName[1]);
                   
                   viewsArray.push($(j).attr("sectionName"));
                    
                    
                   var tempColumnsArray = [];
                   var xmlToString = ($(j).find("column").each(function(k,l)
                                                                
                    {
                        var columnContent = ($(l).html());
                        
                        tempColumnsArray.push(columnContent);
                        //console.log(nodeContent);
                        
                    }));
                    
                    textColumnsArray.push(tempColumnsArray);
                                                                
                    
                });
                
                finishMasterDataLoad();
                
                }//success
            }).fail(function() {
                $("#preloadOverlay").hide();
                $("#detailText").html("Unable to load local view data. Please make sure scripts/js/tte-data.js is present.");
            });

            console.log("End of loadMasterXML");
            console.log("viewsFolderArray");
            console.log(viewsFolderArray);

        }

    function loadMasterRows(rows)
        {
            for (var i = 0; i < rows.length; i++)
                {
                    viewsFolderArray.push(rows[i].folderName);
                    viewsArray.push(rows[i].sectionName);
                    textColumnsArray.push(rows[i].columns);
                }
        }

    function finishMasterDataLoad()
        {
            renderViewSelect();

            if (textColumnsArray.length > 0)
                {
                    $("#textColumn_01").html(textColumnsArray[0][0]);
                    $("#textColumn_02").html(textColumnsArray[0][1] + "<br>");
                    $("#textColumn_03").html(textColumnsArray[0][2] + "<br>");
                    $("#textColumn_04").html(textColumnsArray[0][3] + "<br>");
                }

            var viewIndex = 0;
            $("#preloadOverlay").show();
            applyViewChange(viewIndex);
            togglePreloader();

            console.log("viewSelectionHtmlString");
            console.log($("#viewSelect").html());
        }

    function applyViewChange(viewIndex)
        {
            viewsFolderName = viewsFolderArray[viewIndex];

            changeViewProbePosition(viewIndex);
            changeViewText(viewIndex);

            changeHeartModel(viewIndex);
            changeTEEclip(viewIndex);
            currentViewIndex = viewIndex;
        }

    function preloadViewAssets(viewIndex, callback)
        {
            var folderName = viewsFolderArray[viewIndex];
            var filesToPreload = [
                "spriteSheet_3d.jpg",
                "spriteSheet_vid.jpg",
                "SV.jpg",
                "SV_labeled.jpg",
                "TTE_position.jpg"
            ];
            var remaining = filesToPreload.length;

            function finishOne()
                {
                    remaining--;
                    if (remaining === 0)
                        {
                            callback();
                        }
                }

            for (var i = 0; i < filesToPreload.length; i++)
                {
                    var img = new Image();
                    img.onload = finishOne;
                    img.onerror = finishOne;
                    img.src = "images/" + folderName + "/" + filesToPreload[i];
                }
        }

    function getInitialLanguage()
        {
            var storedLanguage = "";

            try
                {
                    storedLanguage = window.localStorage.getItem("tteInterfaceLanguage") || "";
                }
            catch (error)
                {
                    storedLanguage = "";
                }

            return storedLanguage == "zh" ? "zh" : "en";
        }

    function setLanguage(language)
        {
            currentLanguage = language == "zh" ? "zh" : "en";

            try
                {
                    window.localStorage.setItem("tteInterfaceLanguage", currentLanguage);
                }
            catch (error)
                {
                    // Ignore storage failures in restricted browser contexts.
                }

            document.documentElement.setAttribute("lang", currentLanguage == "zh" ? "zh-CN" : "en");
            document.title = interfaceText[currentLanguage].pageTitle;
            $("#languageSelect").val(currentLanguage);

            $("[data-i18n]").each(function()
                {
                    var textKey = $(this).attr("data-i18n");
                    if (interfaceText[currentLanguage][textKey] != null)
                        {
                            $(this).text(interfaceText[currentLanguage][textKey]);
                        }
                });

            renderViewSelect();
            updateToggleLabels();
            if (textColumnsArray.length > currentViewIndex)
                {
                    changeViewText(currentViewIndex);
                }
        }

    function renderViewSelect()
        {
            if (viewsArray.length == 0)
                {
                    return;
                }

            var selectedView = $("#viewSelect").val();
            var viewSelectionHtmlString = "";

            for (var i = 0; i < viewsArray.length; i++)
                {
                    viewSelectionHtmlString += '<option id="viewOption" value="';
                    viewSelectionHtmlString += i + '">';
                    viewSelectionHtmlString += escapeHtml(getViewDisplayName(viewsArray[i]));
                    viewSelectionHtmlString += '</option>';
                }

            $("#viewSelect").html(viewSelectionHtmlString);

            if (selectedView != null && selectedView != "")
                {
                    $("#viewSelect").val(selectedView);
                }
        }

    function getViewDisplayName(viewName)
        {
            if (currentLanguage == "zh" && viewNameTranslations[viewName])
                {
                    return viewNameTranslations[viewName];
                }

            return viewName;
        }

    function escapeHtml(text)
        {
            return String(text)
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
        }

    function updateToggleLabels()
        {
            var text = interfaceText[currentLanguage];

            setToggleLabel("#viewRibToggle", text.viewRibsOn, text.viewRibsOff);
            setToggleLabel("#viewSliceToggle", text.viewSliceOn, text.viewSliceOff);
            setToggleLabel("#labelsToggle", text.labelsOn, text.labelsOff);
            setToggleLabel("#viewRotatableToggle", text.rotatableOn, text.rotatableOff);
            setToggleLabel("#viewClipOverlay", getClipOverlayLabel(text.clipOverlayOn, "on"), getClipOverlayLabel(text.clipOverlayOff, "off"));
        }

    function setToggleLabel(selector, onText, offText)
        {
            var $toggleInput = $(selector);
            $toggleInput.attr("data-on", onText).attr("data-off", offText);

            var $toggleShell = $toggleInput.closest(".toggle");
            if (!$toggleShell.length)
                {
                    $toggleShell = $toggleInput.parent().find(".toggle").add($toggleInput.next(".toggle")).first();
                }

            $toggleShell.find(".toggle-on").html(onText);
            $toggleShell.find(".toggle-off").html(offText);
        }

    function getClipOverlayLabel(text, state)
        {
            return "<p class='triangle-text-" + state + "'>" + escapeHtml(text) + "</p><div class='triangle-left-" + state + "'><div class='triangle-right-" + state + "'></div></div>";
        }

    function getDetailText(viewIndex, detailIndex)
        {
            if (!textColumnsArray[viewIndex])
                {
                    return "";
                }

            var detailText = textColumnsArray[viewIndex][detailIndex] || "";

            if (currentLanguage == "zh" && window.tteTranslateDetailHtml)
                {
                    return window.tteTranslateDetailHtml(detailText);
                }

            return detailText;
        }
    
    function changeViewProbePosition(arrayPosition)
        {
            $("#TTEposition").html('<img class="center" src="images/' + viewsFolderArray[arrayPosition] + '/TTE_position.jpg" alt="Chest" height="300" width="300">');
            
            console.log("viewsFolderArray[arrayPosition]");
            console.log(viewsFolderArray[arrayPosition]);
        }

    function changeViewText(arrayPosition)
        {
            //detailTextSelected: Selected by Details dropdown
            $("#detailText").html(getDetailText(arrayPosition, detailTextSelected));            
        }
    
    //Display the selected 3D heart model
    function changeHeartModel(arrayPosition)
        {
            
            //var currentBackgroundPosition = $("#heartModelTwoAxisSpin").css('backgroundPosition');
            //var currentBackgroundImage = $("#heartModelTwoAxisSpin").css('backgroundImage');
            //var n = /[^/]*$/.exec(currentBackgroundImage)[0];
            //var currentBackgroundImageTruncated = n.substring(0, n.length -2);
            
            //kinda need to add in code where the user was just looking at SV/SV labeled and then switch views
            var changedBackgroundImage = "";
            if (rotatableView == true)
            { 
                changedBackgroundImage = "url('images/" + viewsFolderArray[arrayPosition] + "/" + "spriteSheet_3d.jpg" + "')";
            }
            else if (rotatableView == false && labelsDisplay == false)
            {
                changedBackgroundImage = "url('images/" + viewsFolderArray[arrayPosition] + "/" + "SV.jpg" + "')";
            }
            else if (rotatableView == false && labelsDisplay == true)
            {
                changedBackgroundImage = "url('images/" + viewsFolderArray[arrayPosition] + "/" + "SV_labeled.jpg" + "')";
            }
            
            $("#heartModelTwoAxisSpin").css('backgroundImage', changedBackgroundImage);
            
          //console.log("changeHeartModel");  
        }
        
    function changeTEEclip(arrayPosition)
        {
            
            var changedTEEclip = "url('images/" + viewsFolderArray[arrayPosition] + "/" + "spriteSheet_vid.jpg" + "')";
            $("#clipPlayer").css('backgroundImage', changedTEEclip);
            
            prepClipSlider();

            //console.log("changeTEEclip");
            
        }
    
    function togglePreloader()
        {

            $('.container').waitForImages({
            finished: function() {
                $("#preloadOverlay").hide();
            },
            each: function() {
               // ...
            },
            waitForAll: true
            });
            
            //console.log("End of togglePreloader");
        }
