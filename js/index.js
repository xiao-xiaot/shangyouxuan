// 当页面载入完毕后执行JavaScript代码
window.onload = function () {
    // 全局变量：鼠标点击的缩略图的下标
    let thumbnailIndex = 0

    /* 动态渲染面包屑导航的数据 */
    navPathBind()
    function navPathBind() {
        // 获取面包屑导航的DOM元素对象
        const navPath = document.getElementsByClassName('navPath')[0]
        // 遍历路径数据
        goodData.path.forEach(obj => {
            // 每次遍历都创建a元素
            const a = document.createElement('a')
            a.innerHTML = obj.title
            if (obj.url)
                a.href = obj.url

            // 每次遍历都创建i元素
            const i = document.createElement('i')
            i.innerHTML = '/'

            // 将a元素和i元素添加成为navPath的子元素
            navPath.appendChild(a)
            navPath.appendChild(i)
        })
        // 遍历完后删除最后一个斜杠元素
        navPath.removeChild(navPath.children[navPath.children.length - 1])
    }

    /* 动态渲染小图框内的蒙版元素、大图框及其内部的大图片 */
    bigClassBind()
    function bigClassBind() {
        // 获取左侧放大镜区域的DOM节点
        const leftTop = document.querySelector('#wrapper #content .contentMain .center .left .leftTop')
        // 获取小图框的DOM节点
        const smallPic = document.querySelector('#wrapper #content .contentMain .center .left .leftTop .smallPic')

        // 创建小图框内的蒙版元素
        const mask = document.createElement('div')
        // 创建大图框
        const bigPic = document.createElement('div')

        // 当鼠标移入小图框时触发一次事件
        smallPic.onmouseenter = function () {
            mask.className = 'mask'
            smallPic.appendChild(mask)

            bigPic.className = 'bigPic'
            const img = document.createElement('img')
            // 动态渲染大图的src
            img.src = goodData.imagessrc[thumbnailIndex].b
            bigPic.appendChild(img)
            leftTop.appendChild(bigPic)
        }

        // 当鼠标在小图框中移动时一直触发事件
        smallPic.onmousemove = function (e) {
            // 浏览器分为两个视口，上面视口是功能区，下面视口是文档展示区，视口的大小和位置是保持不变的
            // 一般来说，文档的高度是超过视口的高度的，但是显示的内容只能是视口的那部分区域

            // clientX: 鼠标指针与浏览器页面视口最左边的距离（值只可能为正数）
            // clientY: 鼠标指针与浏览器页面视口最上边的距离（值只可能为正数）
            // getBoundingClientRect().left: 元素的最左上角坐标相对于浏览器页面视口最左边的距离（值可以为负）
            // getBoundingClientRect().top: 元素的最左上角坐标相对于浏览器页面视口最上边的距离（值可以为负）
            // offsetWidth: 元素的占位宽度
            // offsetHeight: 元素的占位高度

            // 1.想让蒙版元素跟随鼠标移动，原理就是计算蒙版元素的left和top值
            let left = e.clientX - smallPic.getBoundingClientRect().left - mask.offsetWidth / 2
            let top = e.clientY - smallPic.getBoundingClientRect().top - mask.offsetHeight / 2

            // 2.蒙版元素的边界限定
            if (left < 0)
                left = 0
            else if (left > (smallPic.clientWidth - mask.offsetWidth))
                left = smallPic.clientWidth - mask.offsetWidth

            if (top < 0)
                top = 0
            else if (top > (smallPic.clientHeight - mask.offsetHeight))
                top = smallPic.clientHeight - mask.offsetHeight

            // 3.最终将left和top添加到蒙版元素
            mask.style.left = left + 'px'
            mask.style.top = top + 'px'

            // 蒙版元素移动时，右边的大图需要等比例移动
            // 比例 = 蒙版元素移动的距离 / 大图元素移动的距离
            // 蒙版元素移动的距离 = 小图框的宽度 - 蒙版元素的宽度
            // 大图元素移动的距离 = 大图元素的宽度 - 大图框的宽度
            let scale = (smallPic.clientWidth - mask.offsetWidth) / (bigPic.firstElementChild.offsetWidth - bigPic.clientWidth)
            // console.log(scale) // 0.495
            // 那么此时换算（除数 = 被除数 / 商）：大图元素移动的距离 = 蒙版元素移动的距离 / scale
            // 卧槽，我刚刚忘记了最重要的一点：蒙版元素向右移动时，大图元素是向左移动的，所以要加负号
            bigPic.firstElementChild.style.left = -left / scale + 'px'
            bigPic.firstElementChild.style.top = -top / scale + 'px'
        }

        // 当鼠标移出小图框时触发一次事件
        smallPic.onmouseleave = function () {
            smallPic.removeChild(mask)
            // 紧急修复bug：由于在js代码中定义了bigPic的DOM对象，第一次鼠标移入小图框时会给bigPic对象内添加一个img，
            // 但是在鼠标移出小图框时由于bigPic对象的内存没有被释放，导致第二次鼠标移入小图框时，又给bigPic对象内部添加了一个img，
            // 所以添加下面这行代码，每次鼠标移出小图框都需要删除js代码中bigPic对象内部的img
            bigPic.removeChild(bigPic.firstElementChild)
            leftTop.removeChild(bigPic)
        }
    }

    /* 动态渲染缩略图的数据 */
    thumbnailData()
    function thumbnailData() {
        // 拿到缩略图的区域框
        const ul = document.querySelector('#wrapper #content .contentMain .center .left .leftBottom .picsWrap ul')
        // 遍历缩略图的数据
        goodData.imagessrc.forEach(obj => {
            const li = document.createElement('li')
            const img = document.createElement('img')
            img.src = obj.s
            li.appendChild(img)
            ul.appendChild(li)
        })
    }

    /* 鼠标点击每一个缩略图后产生的效果 */
    thumbnailClick()
    function thumbnailClick() {
        // 所有缩略图框
        const lis = document.querySelectorAll('#wrapper #content .contentMain .center .left .leftBottom .picsWrap ul li')
        // 小图
        const smallImg = document.querySelector('#wrapper #content .contentMain .center .left .leftTop .smallPic img')
        // 我们忘记了小图默认的src是写死的，其默认src应该是缩略图数据的第一项
        smallImg.src = goodData.imagessrc[0].s
        // 每一个缩略图框都添加点击事件
        for (var i = 0, len = lis.length; i < len; i++) {
            // for循环是同步代码，事件函数是异步代码，同步代码执行完毕后才执行异步代码
            lis[i].index = i
            lis[i].onclick = function () {
                // console.log(this.index)
                // 更改全局变量：鼠标点击的缩略图的下标，为了让大图可以动态修改其src
                thumbnailIndex = this.index
                // 更改小图的src值
                smallImg.src = goodData.imagessrc[this.index].s
            }
        }
    }

    /* 鼠标点击缩略图的轮播按钮切换缩略图 */
    thumbnailToggle()
    function thumbnailToggle() {
        const ul = document.querySelector('#wrapper #content .contentMain .center .left .leftBottom .picsWrap ul')
        const btn0 = document.querySelectorAll('#wrapper #content .contentMain .center .left .leftBottom a')[0]
        const btn1 = document.querySelectorAll('#wrapper #content .contentMain .center .left .leftBottom a')[1]

        // 每一个li的宽度为56+20=76，起点为0，步长为2*76
        let liWidth = ul.firstElementChild.offsetWidth + 20, left = 0, step = 2 * liWidth
        // ul总宽度
        const totalWidth = ul.children.length * liWidth
        // 缩略图区至少显示五个缩略图，所以left最小值为
        const min = -(totalWidth - 5 * liWidth)
        // left值为ul的left样式，取值范围：min <= left <= 0

        // 点击左边按钮：ul向右移，left增加
        btn0.onclick = function () {
            left += step
            if (left > 0)
                left = 0
            ul.style.left = left + 'px'
        }

        // 点击右边按钮：ul向左移，left减小
        btn1.onclick = function () {
            left -= step
            if (left < min)
                left = min
            ul.style.left = left + 'px'
        }
    }

    /* 商品详情数据的动态渲染 */
    rightTopData()
    function rightTopData() {
        // 获取rightTop元素
        const rightTop = document.querySelector('#wrapper #content .contentMain .center .right .rightTop')
        // 拷贝数据
        const goodsDetail = goodData.goodsDetail
        // 生成模板
        const template = `<h3>${goodsDetail.title}</h3>
<p>${goodsDetail.recommend}</p>
<div class="priceWrap">
    <div class="priceTop">
        <span>价&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;格</span>
        <div class="price">
            <span>￥</span>
            <span>${goodsDetail.price}</span>
            <span>降价通知</span>
        </div>
        <div class="evaluations">
            <span>累计评价</span>
            <span>${goodsDetail.evaluateNum}</span>
        </div>
    </div>
    <div class="priceBottom">
        <span>促&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;销</span>
        <p>
            <span>${goodsDetail.promoteSales.type}</span>
            <span>${goodsDetail.promoteSales.content}</span>
        </p>
    </div>
</div>
<div class="support">
    <span>支&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;持</span>
    <p>${goodsDetail.support}</p>
</div>
<div class="address">
    <span>配&nbsp;送&nbsp;至</span>
    <p>${goodsDetail.address}</p>
</div>`
        // 插入模板
        rightTop.innerHTML = template
    }

    /* 商品参数选项区数据的动态渲染 */
    optionWrapData()
    function optionWrapData() {
        // 获取optionWrap元素对象
        const optionWrap = document.querySelector('#wrapper #content .contentMain .center .right .rightBottom .optionWrap')
        // 拷贝一份数据
        const crumbData = goodData.goodsDetail.crumbData
        // 每一个obj就是一个dl数据对象
        crumbData.forEach(obj => {
            const dl = document.createElement('dl')
            const dt = document.createElement('dt')

            // dl添加第一个dt
            dt.innerText = obj.title
            dl.appendChild(dt)

            // dl添加剩余的dd
            obj.data.forEach(obj2 => {
                const dd = document.createElement('dd')
                dd.innerText = obj2.type
                // 给每个dd身上添加自定义的价格属性
                dd.setAttribute('price', obj2.changePrice)
                dl.appendChild(dd)
            })

            // 每当一个dl生成完毕，optionWrap就添加一个dl
            optionWrap.appendChild(dl)
        })
    }

    /* 点击商品参数之后的效果 */
    clickddBind()
    function clickddBind() {
        // 获取“已选择区”的容器
        const selected = document.querySelector('#wrapper #content .contentMain .center .right .rightBottom .selected')
        // 获取选项区内所有dl元素的集合
        const dlNodes = document.querySelectorAll('#wrapper #content .contentMain .center .right .rightBottom .optionWrap dl')
        // 定义变量selectedArr：用来存放已选择的dd元素
        const selectedArr = new Array(dlNodes.length)
        // 用undefined填充数组
        selectedArr.fill(undefined)
        // console.log(selectedArr)
        // 遍历dlNodes
        for (let i = 0, len = dlNodes.length; i < len; i++) {
            for (let j = 1, len = dlNodes[i].children.length; j < len; j++) {
                // 为所有的dd元素都添加点击事件
                dlNodes[i].children[j].onclick = function () {
                    // 点击商品参数之后的文字颜色排他效果
                    // 点击后首先将本dl元素内部的所有dd元素的样式还原
                    for (let k = 1; k < len; k++) {
                        dlNodes[i].children[k].style.color = '#666'
                        dlNodes[i].children[k].style.border = '1px solid #bbb'
                    }
                    // 然后将选中的那个dd元素的样式单独设定
                    this.style.color = 'red'
                    this.style.border = '1px solid red'


                    // 点击商品参数之后动态渲染“已选择区”的数据
                    // 首先按位置给数组添加dd元素
                    selectedArr[i] = this
                    // console.log(selectedArr)
                    // 然后清空“已选择区”
                    selected.innerHTML = ''
                    // 最后重新渲染“已选择区”
                    selectedArr.forEach((value, index) => {
                        if (value) {
                            const div = document.createElement('div')
                            div.className = 'mark'
                            const span = document.createElement('span')
                            span.innerText = value.innerText
                            const a = document.createElement('a')
                            a.href = 'javascript:;'
                            a.innerText = 'X'
                            // 给每个关闭按钮添加一个标识，其值为所在数组的下标
                            a.setAttribute('index', index)
                            div.appendChild(span)
                            div.appendChild(a)
                            selected.appendChild(div)
                        }
                    })


                    // 点击已选择参数的取消按钮的效果（前提是存在已选择参数的情况下）
                    // 获取所有的取消按钮
                    const aNodes = selected.querySelectorAll('.mark a')
                    // 为所有的取消按钮绑定点击事件
                    for (let i = 0, len = aNodes.length; i < len; i++) {
                        aNodes[i].onclick = function () {
                            // 获取点击的取消按钮在selectedArr中的位置（需要用到前面给a设置的标识）
                            let index = this.getAttribute('index')
                            // 将取消的那个参数重置为undefined
                            selectedArr[index] = undefined
                            // console.log(selectedArr)
                            // 移除取消的商品参数的DOM
                            selected.removeChild(this.parentNode)
                            // 将移除的那个参数的对应选项区的那一行dd元素的样式还原
                            for (let j = 1, len = dlNodes[index].children.length; j < len; j++) {
                                dlNodes[index].children[j].style.color = '#666'
                                dlNodes[index].children[j].style.border = '1px solid #bbb'
                            }
                            // 点击取消参数按钮之后动态计算商品总价格（调用已封装好的函数）
                            // 每次点击都传入装有已选dd元素的数组
                            changePriceBind(selectedArr)
                        }
                    }


                    // 点击商品参数之后动态计算商品总价格（调用已封装好的函数）
                    // 每次点击都传入装有已选dd元素的数组
                    changePriceBind(selectedArr)
                }
            }
        }
    }

    /* 封装商品价格变动的函数（每次点击dd元素时调用、每次点击取消参数按钮时调用） */
    function changePriceBind(selectedArr) {
        // 获取商品总价格的DOM
        const priceNode = document.querySelector('#wrapper #content .contentMain .center .right .rightTop .priceWrap .priceTop .price > span:nth-of-type(2)')
        // 获取初始价格
        let price = goodData.goodsDetail.price
        // 遍历装有已选dd元素的数组，每次此函数被调用时，都将初始价格与已选dd元素数组里面所有的价格相加
        selectedArr.forEach(value => {
            if (value) {
                price += parseFloat(value.getAttribute('price'))
            }
        })
        // 相加完毕后重新渲染DOM的价格
        priceNode.innerText = price
        // 相加完毕后调用选择搭配区的函数
        chooseMatchingPrice()
    }

    /* 选择搭配区域商品价格联动 */
    chooseMatchingPrice()
    function chooseMatchingPrice() {
        // 获取上边价格的DOM
        const priceNode = document.querySelector('#wrapper #content .contentMain .center .right .rightTop .priceWrap .priceTop .price > span:nth-of-type(2)')
        // 获取左边旧价格的DOM
        const oldPriceNode = document.querySelector('#wrapper #content .contentMain .goodsDetailWrap .rightDetail .chooseBox .listWrap .left p')
        // 获取右边新价格的DOM
        const newPriceNode = document.querySelector('#wrapper #content .contentMain .goodsDetailWrap .rightDetail .chooseBox .listWrap .right i')
        // 左边价格初始化
        oldPriceNode.innerText = '￥' + priceNode.innerText

        // 获取所有商品搭配复选框的DOM
        const checkboxNodes = document.querySelectorAll('#wrapper #content .contentMain .goodsDetailWrap .rightDetail .chooseBox .listWrap ul.middle li input')

        // 遍历所有复选框
        for (let i = 0, len = checkboxNodes.length; i < len; i++) {
            // 给每个复选框都添加表单事件
            checkboxNodes[i].onchange = function () {
                // 每次点击某一个复选框时，都需要重新更新右边的价格
                update()
            }
        }

        /*
        右边价格更新的情况：
        1. 一上来初始化更新
        2. 选中/取消 复选框时更新
        3. 点击商品参数初始化左边价格后，再更新右边价格
        */
        // 封装更新右边价格的函数
        update()
        function update() {
            let sum = 0
            for (let v of checkboxNodes) {
                if (v.checked === true)
                    sum += parseFloat(v.value)
            }
            // 右边价格 = 左边价格 + sum
            let oldPrice = parseFloat(oldPriceNode.innerText.slice(1))
            newPriceNode.innerText = '￥' + (oldPrice + sum)
        }
    }

    /* 封装一个公共的切换选项卡的函数 */
    // 几个选项卡对应几个内容区
    function switchTabs(tabs, contents) {
        for (let i = 0, len = tabs.length; i < len; i++) {
            // 给每一个选项卡添加点击事件
            tabs[i].onclick = function () {
                // 点击某一个选项卡时，首先清除选项卡和内容区所有的class属性
                for (let j = 0; j < len; j++) {
                    tabs[j].removeAttribute('class')
                    contents[j].removeAttribute('class')
                }
                // 然后给对应的选项卡和内容区都添加类名“active”
                this.className = 'active'
                contents[i].className = 'active'
            }
        }
    }

    /* 侧边栏选项卡切换、底部选项卡切换 */
    switchingTabs()
    function switchingTabs() {
        const asideTabs = document.querySelectorAll('#wrapper #content .contentMain .goodsDetailWrap .leftAside .asideTop > h4')
        const asideContents = document.querySelectorAll('#wrapper #content .contentMain .goodsDetailWrap .leftAside .asideBottom > div')
        const bottomTabs = document.querySelectorAll('#wrapper #content .contentMain .goodsDetailWrap .rightDetail .bottomDetails ul.tabs > li')
        const bottomContents = document.querySelectorAll('#wrapper #content .contentMain .goodsDetailWrap .rightDetail .bottomDetails .tabsContent > div')
        switchTabs(asideTabs, asideContents)
        switchTabs(bottomTabs, bottomContents)
    }

    /* 抽屉区域的打开与关闭效果 */
    drawerClickBind()
    function drawerClickBind() {
        // 获取抽屉的DOM
        const drawerNode = document.querySelector('#wrapper .drawer')
        // 获取抽屉开关的DOM
        const switchNode = document.querySelector('#wrapper .drawer .switch')
        // 给抽屉的开关添加点击事件
        switchNode.onclick = function () {
            // 获取抽屉和开关的第一个class值
            let str1 = drawerNode.className.split(' ')[0]
            let str2 = switchNode.className.split(' ')[0]
            if (switchNode.className.includes('close')) {
                drawerNode.className = str1 + ' ' + 'open'
                switchNode.className = str2 + ' ' + 'open'
            } else {
                drawerNode.className = str1 + ' ' + 'close'
                switchNode.className = str2 + ' ' + 'close'
            }
        }
    }
}