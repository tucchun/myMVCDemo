//展业项目信用卡本地localstorage 3dex加密
//安卓设备加密，非安卓设备不加密
String.prototype.En3DexCode = function(){
    var str = this.valueOf();
    return (App.encryptWith3DES(str)) || str;
}
//展业项目信用卡本地localstorage 3dex解密
//安卓设备解密，非安卓设备不解密
String.prototype.De3DexCode = function(){
    var str = this.valueOf();
    return ( App.decryptBy3DES(str) ) || str;
};
/**
 * Backbone localStorage Adapter
 * https://github.com/jeromegn/Backbone.localStorage
 */

(function (_, Backbone) {
// A simple module to replace `Backbone.sync` with *localStorage*-based
// persistence. Models are given GUIDS, and saved into a JSON object. Simple
// as that.

// Hold reference to Underscore.js and Backbone.js in the closure in order
// to make things work even if they are removed from the global namespace

// Generate four random hex digits.
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };

// Generate a pseudo-GUID by concatenating random hexadecimal.
    function guid() {
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    };

// Our Store is represented by a single JS object in *localStorage*. Create it
// with a meaningful name, like the name you'd give a table.
// window.Store is deprectated, use Backbone.LocalStorage instead
    Backbone.LocalStorage = window.Store = function (name) {
        this.NS(name);
    };

    _.extend(Backbone.LocalStorage.prototype, {
        //switch to new namespace
        NS: function(name){
            this.name = name;
            this.repairStorage(name);
            var store = this.localStorage().getItem(this.name);
            this.records = (store && store.split(",")) || [];
            return this;
        },

        // Save the current state of the **Store** to *localStorage*.
        save: function () {
            this.localStorage().setItem(this.name, this.records.join(","));
            return this;
        },

        // Add a model, giving it a (hopefully)-unique GUID, if it doesn't already
        // have an id of it's own.
        create: function (model) {
            if (!model.id) {
                model.id = guid();
                model.set(model.idAttribute, model.id);
                //return false;
            } else {
            }
            return this.update(model);
        },

        // Update a model by replacing its copy in `this.data`.
        update: function (model) {
            this.localStorage().setItem( this.name+"-"+model.id, JSON.stringify(model).En3DexCode() );
            if ( !_.contains(this.records, model.id.toString()) ) this.records.push(model.id.toString());
            this.save();
            return model.toJSON();
        },

        // Retrieve a model from `this.data` by id.
        find: function (model) {
            this.NS(this.name);
            var id = model instanceof Backbone.Model ? model.id : String(model),
                result = this.localStorage().getItem(this.name+"-"+ id );

            if ( _.isEmpty(result) ) {
                this.destroy(model);
                return null;
            }

            try {
                try {
                    result = JSON.parse( result.De3DexCode() );//尝试解析密文
                } catch (ex) {
                    if (ex instanceof SyntaxError)
                        result = JSON.parse( result );//解析明文
                    else
                        throw ex;
                }
            } catch (ex) {
                return null;
            }

            return result;
        },

        // Return the array of all models currently in storage.
        findAll: function (filter) {
            this.NS(this.name);
            var records = [];
            var filter = filter || {};
            records = filter.ids || this.records;
            if (typeof filter.offset != 'undefined' && filter.offset >= 0) {
                records = records.slice(filter.offset, filter.offset + filter.limit || 15);
            }

            return _(records).chain()
                .map(function (id) {
                    return this.find(id);
                }, this)
                .compact()
                .value();
        },

        // Delete a model from `this.data`, returning it.
        destroy: function (model) {
            var id = model instanceof Backbone.Model ? model.id : String(model);
            this.localStorage().removeItem(this.name + "-" + id);
            this.records = _.reject(this.records, function (record_id) {
                return record_id == id.toString();
            });
            this.save();
            return model;
        },

        localStorage: function () {
            return localStorage;
        },

        total: function(){
            return this.records.length;
        },
        repairStorage : function(name){
            if (!name) return;
            var repair_key = "";
            var count = 0;
            for (var key in window.localStorage)
            {
                if (key.indexOf(name) != -1)
                {
                    if (count != 0)
                    {
                        repair_key += ("," + key.substr(name.length+1));
                    }
                    else
                    {
                        repair_key += key.substr(name.length+1);
                    }
                    count ++;
                }
            }
            window.localStorage.setItem(name, repair_key);
        }
    });

// localSync delegate to the model or collection's
// *localStorage* property, which should be an instance of `Store`.
// window.Store.sync and Backbone.localSync is deprectated, use Backbone.LocalStorage.sync instead
    Backbone.LocalStorage.sync = window.Store.sync = Backbone.localSync = function (method, model, options) {
        var store = model.localStorage || model.collection.localStorage;

        var resp, syncDfd = $.Deferred && $.Deferred(); //If $ is having Deferred - use it.

        switch (method) {
            case "read":
                resp = model.id != undefined ? store.find(model) : store.findAll(options);
                break;
            case "create":
                resp = store.create(model);
                break;
            case "update":
                resp = store.update(model);
                break;
            case "delete":
                resp = store.destroy(model);
                break;
        }

        if (resp) {
            if (options && options.success) options.success(resp);
            if (syncDfd) syncDfd.resolve();
        } else {
            if (options && options.error) options.error("数据无法创建");
            if (syncDfd) syncDfd.reject();
        }

        return syncDfd && syncDfd.promise();
    };

    Backbone.ajaxSync = Backbone.sync;

    Backbone.getSyncMethod = function (model) {
        if (model.localStorage || (model.collection && model.collection.localStorage)) {
            return Backbone.localSync;
        }

        return Backbone.ajaxSync;
    };

// Override 'Backbone.sync' to default to localSync,
// the original 'Backbone.sync' is still available in 'Backbone.ajaxSync'
    Backbone.sync = function (method, model, options) {
        return Backbone.getSyncMethod(model).apply(this, [method, model, options]);
    };

})(_, Backbone);
