(function(vc){
    vc.extends({
        propTypes: {
           emitChooseResourceStore:vc.propTypes.string,
           emitLoadData:vc.propTypes.string
        },
        data:{
            chooseResourceStoreInfo2:{
                resourceStores:[],
                selectResourceStores:[],
                _currentResourceStoreName:'',
            }
        },
        _initMethod:function(){
        },
        _initEvent:function(){
            vc.on('chooseResourceStore2','openChooseResourceStoreModel2',function(_param){
                $('#chooseResourceStoreModel2').modal('show');
                vc.component._refreshchooseResourceStoreInfo2();
                vc.component._loadAllResourceStoreInfo(1,10,'');
            });
        },
        methods:{
            _loadAllResourceStoreInfo:function(_page,_row,_name){
                var param = {
                    params:{
                        page:_page,
                        row:_row,
                        communityId:vc.getCurrentCommunity().communityId,
                        name:_name
                    }
                };

                //发送get请求
               vc.http.get('chooseResourceStore',
                            'list',
                             param,
                             function(json){
                                var _resourceStoreInfo = JSON.parse(json);
                                vc.component.chooseResourceStoreInfo2.resourceStores = _resourceStoreInfo.resourceStores;
                             },function(){
                                console.log('请求失败处理');
                             }
                           );
            },
            chooseResourceStore:function(_resourceStore){
                if(_resourceStore.hasOwnProperty('name')){
                     _resourceStore.resourceStoreName = _resourceStore.name;
                }
                vc.emit($props.emitChooseResourceStore,'chooseResourceStore',_resourceStore);
                vc.emit($props.emitLoadData,'listResourceStoreData',{
                    resourceStoreId:_resourceStore.resourceStoreId
                });
                $('#chooseResourceStoreModel').modal('hide');
            },
            queryResourceStores:function(){
                vc.component._loadAllResourceStoreInfo(1,10,vc.component.chooseResourceStoreInfo2._currentResourceStoreName);
            },
            _refreshchooseResourceStoreInfo2:function(){
                vc.component.chooseResourceStoreInfo2._currentResourceStoreName = "";
            },
            getSelectResourceStores:function () {
                var selectResourceStores = vc.component.chooseResourceStoreInfo2.selectResourceStores;
                var resourceStores = vc.component.chooseResourceStoreInfo2.resourceStores;
                if(selectResourceStores.length <1){
                    vc.toast("请选择需要采购的物品");
                    return ;
                }
                var _resourceStores = [];
                for( var i = 0; i < selectResourceStores.length; i++){
                    for( j = 0; j < resourceStores.length; j++){
                        if(selectResourceStores[i] == resourceStores[j].resId){
                            _resourceStores.push({
                                resId:resourceStores[j].resId,
                                resName:resourceStores[j].resName,
                                resCode:resourceStores[j].resCode,
                                price:resourceStores[j].price,
                                stock:resourceStores[j].stock,
                                description:resourceStores[j].description,
                            })
                        }
                    }
                }
                //传参
                vc.emit("viewResourceStoreInfo2","setSelectResourceStores",_resourceStores);
                $('#chooseResourceStoreModel2').modal('hide');
            }
        }

    });
})(window.vc);
