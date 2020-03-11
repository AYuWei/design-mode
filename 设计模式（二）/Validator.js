// 表单验证

function Validator(){
    this.cache = [];
    this.warnDom = [];  //警告的dom
}
Validator.prototype.strategies = {
    isNonEmpty : function(value, errorMsg){
        if(value == ''){
            return errorMsg;
        }
        return true;
    }, // 不能为空
    maxLength : function(value, length, errorMsg){
        if(value != "" && value.length > length){
            return errorMsg;
        }
        return true;
    },  // 最大长度
    minLength : function(value, length, errorMsg){
        if(value != '' && value.length < length){
            return errorMsg;
        }
        return true;
    },  // 最小长度
}

Validator.prototype.add = function(dom,showDom, strategyArr){
    var self = this;
    this.warnDom.push(showDom);
    strategyArr.forEach(function(ele, index) {
        self.cache.push(function(){
            // arr => ['isNonEmpty'] ['maxLength', '4'];
            var arr = ele.strategy.split(":");
            // arr => [] [4]
            var type = arr.shift();// 剔除掉第一位
            // [dom.value] [dom.value, '4']
            arr.unshift(dom.value);
            // [dom.value, errorMsg] [dom.value, '4' , errorMsg]
            arr.push(ele.errorMsg);

            var msg = self.strategies[type].apply(self, arr);
            if(msg != true){
                showDom.innerText = msg;
            } 
            return msg

        })
    })
}

Validator.prototype.start = function(){
    // 标记最后是否能符合规则
    var flag = true;
    this.warnDom.forEach((ele)=>{
        ele.innerText = '';
    })
    this.cache.forEach(ele=>{
        if(ele() !== true){
            flag = false;
        }
    })
    return flag;
}

Validator.prototype.extend = function(config){
    for(var prop in config){
        Validator.prototype.strategies[prop] = config[prop]
    }
}