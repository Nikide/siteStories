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
    mouseDrag: $('.editor').length == 1 ? false : true,
    responsive: {
        1000: {
            items: $('.editor').length == 1 ? 1 : 2
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
/**
 * 
 * @param {number} duration Длиельность
 */
function initInterval(duration) {
    clearTimeout(interval);
    interval = setTimeout(nexSlide, duration)
}

/**
 * Обрабодчик смены слайда
 */
slider.events.on('indexChanged', function () {

    var info = slider.getInfo()
    $($('.tns-item > .inner').get(info.indexCached)).removeClass('active')  //Убераем эффекты с предыдущего слайда
    $($('.tns-item > .inner').get(info.displayIndex - 1)).addClass('active') //Добавляем эффекты к текущему слайду
    /**
     * Обработка анимациий
     */
    $($('.tns-item > .inner').get(info.displayIndex - 1)).find('.animation').each(function () { //Запускаем анимации у текущего слайда
        $(this).addClass('start')
    })
    $($('.tns-item > .inner').get(info.indexCached)).find('.animation').each(function () { //Убераем анимцаии у предыдущего слайда
        info.indexCached !== (info.displayIndex - 1) && $(this).removeClass('start')
    })
    /**
     * Запуск прогесс бара и интервала
     */
    /**
     * Если есть data-duration, то берем из него длительность слайда
     */
    if ($($('.slide').get(info.displayIndex - 1)).data('duration') !== undefined) {
        $('.editor').length != 1 && startProgress(info.displayIndex - 1, $($('.slide').get(0)).data('duration'))
        $('.editor').length != 1 && initInterval($($('.slide').get(0)).data('duration'))
    } else {
        /**
         * Если duration не объявленна, то ставим станадартную продолжительность
         */
        $('.editor').length != 1 && startProgress(info.displayIndex - 1, 5000)
        $('.editor').length != 1 && initInterval(5000)
    }

    /**
     * Работа с видео
     */
    if($($('.tns-item > .inner').get(info.displayIndex - 1)).find('video').length == 1){
        var video = $($($('.tns-item > .inner').get(info.displayIndex - 1)).find('video')).get(0); //Может можно и проще
        video.pause()
        video.currentTime = 0;
        video.play();
        console.log(video.duration * 1000);
        /**
         * Переопределяем интервал
         */
        startProgress(info.displayIndex - 1, video.duration * 1000)
        initInterval(video.duration * 1000)
    }else if($($('.tns-item > .inner').get(info.indexCached)).find('video').length == 1){ //Останавливаем видео при смене слайда
        var video = $($($('.tns-item > .inner').get(info.indexCached)).find('video')).get(0); //Может можно и проще
        video.pause()
    }
})
/**
 * Ловим события с колеса мыши для преключения слайдов
 */
$('.editor').length != 1 && $(window).on('wheel', function (event) {
    if (event.originalEvent.deltaY < 0) { //Колесо мыши вниз
        if (slider.getInfo().displayIndex != 1) {
            slider.goTo(slider.getInfo().displayIndex - 2)
        }

    } else {//Колесо мыши вверх
        if (slider.getInfo().slideCount != slider.getInfo().displayIndex) {
            slider.goTo(slider.getInfo().displayIndex)

        }
    }
});

/**
 * Запуск прогресс бара по index слайда
 * @param {number} index - index слайда  
 * @param {number} duration - Длительность слайда (от интервала)
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

    })
    /**
     * Запускаем прогресс для выбранного слайда
     */
    $("div").find("[data-for='" + index + "']").stop().css({ width: 0 }).animate({ width: "100%" }, duration)

}
/**
 * Останавливает слайд заполняем прогрессбар
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
function initForm() {
    $('.fields').slideToggle()
    $('.send-btn').addClass('is-loading')
}
function doneForm() {
    $('.send-btn').slideToggle('fast')
    $('.success').slideToggle('fast')
}
/**
 * Странциа загрузилась
 */
$(window).on('load', function () {

    $('#preloader').fadeOut(); //Убераем прелоадер
    /**
     * Запускаем анимации для первого слайда
     * 
     */
    $($('.tns-item > .inner').get(0)).find('.animation').each(function () {
        $(this).addClass('start')
    })
    for (var index = 0; index < slider.getInfo().slideCount; index++) {
        $('.navigation > .columns').append('<div class="column"><div id="for' + index + '" class="loading"><div  data-for="' + index + '" class="progress"></div></div></div>')
        /**
         * Все прогрессбары отрисованны
         */
        if (index == (slider.getInfo().slideCount - 1)) {
            /**
             * Запуск первого прогресс бара
             */
            if ($($('.slide').get(slider.getInfo().displayIndex - 1)).data('duration') !== undefined) {
                $('.editor').length != 1 && startProgress(slider.getInfo().displayIndex - 1, $($('.slide').get(0)).data('duration'))
                $('.editor').length != 1 && initInterval($($('.slide').get(0)).data('duration'))
            } else {
                $('.editor').length != 1 && startProgress(slider.getInfo().displayIndex - 1, 5000)
                $('.editor').length != 1 && initInterval(5000)
            }
        }

    }
    /**
     * Ловим клики по прогрессбару
     */
    $('.navigation > .columns > .column').on('click', function () {
        slider.goTo($(this).find('.progress').data('for'))
    })
    /**
     * Расчитываем клик/тап по процентам от экрана
     */
    $('.editor').length != 1 &&  $('.main').on('click', function (e) {
        /**
         * Текущий процент от ширины экрана
         */
        var percent = e.clientX / $(this).width() * 100;
        /**
         * Если данный процент, то переходим к следующему слайда
         */
        if (percent >= 75) {
            /**
             * Переходим к следующему слайду только если не последний слайд
             */
            slider.getInfo().displayIndex != slider.getInfo().slideCount &&
                slider.goTo(slider.getInfo().displayIndex)
        } else if (percent <= 25) {
            /**
             * Переходим к предыдущему слайду
             */
            slider.getInfo().displayIndex != 1 &&
                slider.goTo(slider.getInfo().displayIndex - 2)
        } else {
            /**
             * Останавливаем слайд если процент меньше чем нужно для перехода на слудующий слайд
             */
            stopProgres()
        }
    })
});
