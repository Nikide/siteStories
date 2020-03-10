/**
 * == SiteStories == 
 * 
 * @author Nikita Demchev 2020
 */


/**
 * @description Инициализирует слайдер
 */
var slider = tns({
    container: '.story',
    slideBy: 'page',
    autoplay: false,
    controls: false,
    "center": true,
    rewind: true,
    nav: false,
    autoplayButtonOutput: false,
    speed: 500,
    mouseDrag: true,
    responsive: {
        1000: {
            items: 2
        },
        900: {
            items: 1
        }
    }
});
/**
 * Переключение слайда на следующий, с остановкой на последнем
 */
function nexSlide() {
    slider.getInfo().displayIndex != slider.getInfo().slideCount &&
        slider.goTo(slider.getInfo().displayIndex)
}

/**
 * Инициализация интервала переключения слайда
 */

var interval;

function initInterval(duration) {
    clearTimeout(interval);
    interval = setTimeout(nexSlide, duration)
}

/**
 * Start all events when change slide
 */
slider.events.on('indexChanged', function () {

    var info = slider.getInfo()
    $($('.tns-item > .inner').get(info.indexCached)).removeClass('active')
    $($('.tns-item > .inner').get(info.displayIndex - 1)).addClass('active')
    //console.log(`prevIndex: ${info.indexCached}\nDisplay:${info.displayIndex - 1}`)
    /**
     * Animation
     */
   // info.indexCached !== (info.displayIndex - 1) && console.log('no');

    $($('.tns-item > .inner').get(info.displayIndex - 1)).find('.animation').each(function () {
        $(this).addClass('start')
    })
    $($('.tns-item > .inner').get(info.indexCached)).find('.animation').each(function () {
        info.indexCached !== (info.displayIndex - 1) && $(this).removeClass('start')
    })
    /**
     * Запуск прогесс бара и интервала
     */

    if ($($('.slide').get(info.displayIndex - 1)).data('duration') !== undefined) {
        startProgress(info.displayIndex - 1, $($('.slide').get(0)).data('duration'))
        initInterval($($('.slide').get(0)).data('duration'))
    } else {
        startProgress(info.displayIndex - 1, 5000)
        initInterval(5000)
    }
})
$(window).on('wheel', function (event) {

    // deltaY obviously records vertical scroll, deltaX and deltaZ exist too
    if (event.originalEvent.deltaY < 0) {
        if (slider.getInfo().displayIndex != 1) {
            slider.goTo(slider.getInfo().displayIndex - 2)
        }

    }
    else {
        if (slider.getInfo().slideCount != slider.getInfo().displayIndex) {
            slider.goTo(slider.getInfo().displayIndex)

        }
    }
});

/**
 * Start progress bar for index
 * @param {number} index - Index of slide  
 * @param {number} duration - Duration of slider based on setTimeout
 */

function startProgress(index, duration) {

    $('.loading > .progress').each(function (i) {
        /**
         * Если не первый слайд, заполняем прогресс бар прошлых слайдов до 100%
         */
        index != 0 &&
            $(this).data('for') < index && $(this).stop().css({ width: "100%" });

        /**
         * Если не последний слайд, очищаем прогресс бар слайдов впереди
         */
        index != (slider.getInfo().slideCount - 1) &&
            $(this).data('for') > index && $(this).stop().css({ width: "0" });
       // console.log(($(this).data('for') < index) + ' ' + i);

    })
    /**
     * Запускаем прогресс для выбранного слайда
     */
    $("div").find("[data-for='" + index + "']").stop().css({ width: 0 }).animate({ width: "100%" }, duration)

}
/**
 * Останавливает слайд
 */
function stopProgres() {
    clearTimeout(interval);
    $("div").find("[data-for='" + (slider.getInfo().displayIndex - 1) + "']").stop().css({ width: 0 }).css({ width: "100%" })
}

/**
 * Form
 */

function viewForm() {
    $('.send-form').addClass('view');
}

$(window).on('load',function() {
    $('#preloader').fadeOut();
    /**
     * Autoplay animation first slide
     * 
     */
    $($('.tns-item > .inner').get(0)).find('.animation').each(function () {
        $(this).addClass('start')
    })
    for (var index = 0; index < slider.getInfo().slideCount; index++) {
        $('.navigation > .columns').append('<div class="column"><div id="for' + index + '" class="loading"><div  data-for="' + index + '" class="progress"></div></div></div>')
        //All progress bars rendered
        if (index == (slider.getInfo().slideCount - 1)) {
            /**
             * Start first progressbar
             */
            if ($($('.slide').get(slider.getInfo().displayIndex - 1)).data('duration') !== undefined) {
                startProgress(slider.getInfo().displayIndex - 1, $($('.slide').get(0)).data('duration'))
                initInterval($($('.slide').get(0)).data('duration'))
            } else {
                startProgress(slider.getInfo().displayIndex - 1, 5000)
                initInterval(5000)
            }
        }

    }
    $('.navigation > .columns > .column').on('click',function(){
      slider.goTo($(this).find('.progress').data('for'))  
    })
    /**
     * Клики по процентам почему бы и нет
     */
    $('.main').on('click',function(e){
        var percent = e.clientX / $(this).width() * 100;
       if(percent >= 75){
        slider.getInfo().displayIndex != slider.getInfo().slideCount && slider.goTo(slider.getInfo().displayIndex)
       }else{
           stopProgres()
       }
       //console.log(e);
       
        
    })
});