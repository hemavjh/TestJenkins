﻿/*
 * autor: Miller Augusto S. Martins
 * e-mail: miller.augusto@gmail.com
 * github: miamarti
 * */
(function (m, n) {
    angular.module("ng.ckeditor", ["ng"]).directive("ngCkeditor", function () {
        CKEDITOR.on("instanceCreated", function (a) {
            var c = a.editor; if ("simpleEditor" == c.element.getAttribute("class")) c.on("configLoaded", function () {
                c.config.removePlugins = "colorbutton,find,flash,font, forms,iframe,image,newpage,removeformat, smiley,specialchar,stylescombo,templates"; c.removeButtons = "About"; c.config.toolbarGroups = [{ name: "editing", groups: ["basicstyles", "links"] }, { name: "undo" }, {
                    name: "clipboard", groups: ["selection",
                    "clipboard"]
                }]
            })
        }); return {
            restrict: "E", scope: { ngModel: "=ngModel", ngChange: "=ngChange", ngDisabled: "=ngDisabled", ngConfig: "=ngConfig" }, link: function (a, c, b) {
                c[0].innerHTML = '<div class="ng-ckeditor"></div> <div class="totalTypedCharacters"></div>'; var h = c[0].querySelectorAll(".ng-ckeditor"), d = { removeButtons: void 0 != b.removeButtons ? "About," + b.removeButtons : "About", readOnly: a.ngDisabled ? a.ngDisabled : !1 }; void 0 != b.removePlugins && (d.removePlugins = b.removePlugins); void 0 != b.skin && (d.skin = b.skin); void 0 != b.width &&
                (d.width = b.width); void 0 != b.height && (d.height = b.height); void 0 != b.resizeEnabled && (d.resize_enabled = "false" == b.resizeEnabled ? !1 : !0); var e = CKEDITOR.appendTo(h[0], a.ngConfig ? a.ngConfig : d, ""), k = function (f) { f.on("change", function (f) { a.$apply(function () { a.ngModel = f.editor.getData() }); void 0 != b.msnCount && (element[0].querySelector(".totalTypedCharacters").innerHTML = b.msnCount + " " + f.editor.getData().length); a.ngChange && "function" === typeof a.ngChange && a.ngChange(f.editor.getData()) }); f.on("focus", function (b) { f.setData(a.ngModel) }) },
                g = void 0, l = function (a, b) { g && clearTimeout(g); g = setTimeout(function () { a && b ? b.setData(a) : b && b.setData("") }, 1E3) }; k(e); a.$watch("ngModel", function (a) { a !== e.getData() && l(a, e) }); a.$watch("ngDisabled", function (b) { d.readOnly = b ? !0 : !1; e.destroy(); e = CKEDITOR.appendTo(h[0], a.ngConfig ? a.ngConfig : d, ""); k(e); e.setData(a.ngModel) })
            }
        }
    })
})(window, document);