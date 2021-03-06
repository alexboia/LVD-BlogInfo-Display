/**
 * Copyright (c) 2019-2020 Alexandru Boia
 *
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 * 
 *	1. Redistributions of source code must retain the above copyright notice, 
 *		this list of conditions and the following disclaimer.
 *
 * 	2. Redistributions in binary form must reproduce the above copyright notice, 
 *		this list of conditions and the following disclaimer in the documentation 
 *		and/or other materials provided with the distribution.
 *
 *	3. Neither the name of the copyright holder nor the names of its contributors 
 *		may be used to endorse or promote products derived from this software without 
 *		specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" 
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, 
 * THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. 
 * IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY 
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES 
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; 
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) 
 * HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, 
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) 
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE.
 */

(function($) {
    "use strict";

    var clipboard = null;
    var filterTimer = null;
    var $filteredHost = null;

    function disableWindowScroll() {
        $('body').addClass('lvdbid-stop-scrolling');
    }

    function enableWindowScroll() {
        $('body').removeClass('lvdbid-stop-scrolling');
    }

    function showLoading() {
        $.blockUI({
            message: 'Please wait...',
            css: {
                border: 'none', 
                padding: '15px', 
                backgroundColor: '#000', 
                opacity: .5, 
                color: '#fff' 
            },

            onBlock: disableWindowScroll,
            onUnblock: enableWindowScroll
        });
    }

    function hideLoading() {
        $.unblockUI();
    }

    function listenForEscapeKeyAndUnblockUi() {
        var shouldUnblockFn = arguments.length == 1 && $.isFunction(arguments[0])
            ? arguments[0]
            : function() { 
                return true; 
            };

        $(document).on('keydown', function(e) {
            if (e.which == 27 && shouldUnblockFn()) {
                $.unblockUI();
                e.preventDefault();
                e.stopPropagation();
            }
        });
    }

    $(document).ready(function() {
        if (window.ClipboardJS != undefined) {
            clipboard = new ClipboardJS('.lvdbid-copy-handler');
        }

        $('#lvdbid-table-filter').keyup(function() {
            var $filterInput = $(this);
            if (filterTimer !== null) {
                window.clearTimeout(filterTimer);
            }

            filterTimer = window.setTimeout(function() {
                filterTimer = null;

                if ($filteredHost === null) {
                    $filteredHost = $($filterInput.attr('data-filtered-host'));
                }

                var keyword = ($filterInput.val() || '')
                    .toLowerCase();

                $filteredHost.find('tr').each(function(index, element) {
                    var $target = $(element);
                    var compareText = ($target.find('.lvdbid-filtered-column').text() || '')
                        .toLowerCase();

                    $target.toggle(!keyword || compareText.indexOf(keyword) >= 0);
                });
            }, 100);
        });
    });

    if (window.lvdbid == undefined) {
        window.lvdbid = {};
    }

    window.lvdbid = $.extend(window.lvdbid, {
        showLoading: showLoading,
        hideLoading: hideLoading,
        enableWindowScroll: enableWindowScroll,
        disableWindowScroll: disableWindowScroll,
        listenForEscapeKeyAndUnblockUi: listenForEscapeKeyAndUnblockUi
    });
})(jQuery);