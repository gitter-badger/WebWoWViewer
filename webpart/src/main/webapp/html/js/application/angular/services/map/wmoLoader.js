/**
 * Created by Deamon on 29/01/2015.
 */
(function (window, $, undefined) {
    var wmoLoader = angular.module('main.services.map.wmoLoader', ['main.services.chunkedLoader', 'main.services.fileReadHelper']);

    /*
    * Loader for group wmo files
    * These files contain geometry
    * */
    wmoLoader.factory('wmoGroupLoader', ["chunkedLoader", "fileReadHelper", "$q", '$log', function (chunkedLoader, fileReadHelper,  $q, $log) {
        return function(wmoFilePath, loadPlainVertexes) {
            var deferred = $q.defer();

            var wmogroup_ver17 = {
                "MOGP" : {
                    "MOGP": function (groupWMOObject, chunk) {
                        var offset = {offs : 0};
                        var mogp = {};

                        mogp.GroupName       = chunk.readInt32(offset);
                        mogp.dGroupName      = chunk.readInt32(offset);
                        mogp.Flags           = chunk.readInt32(offset);
                        mogp.BoundBoxCorner1 = chunk.readVector3f(offset);
                        mogp.BoundBoxCorner2 = chunk.readVector3f(offset);
                        mogp.Index           = chunk.readInt16(offset);
                        mogp.numItems        = chunk.readInt16(offset);
                        mogp.numBatchesA     = chunk.readInt16(offset);
                        mogp.numBatchesB     = chunk.readInt16(offset);
                        mogp.numBatchesC     = chunk.readInt16(offset);
                        mogp.Indeces         = chunk.readUint8Array(offset, 4);
                        mogp.Unk1            = chunk.readInt32(offset);
                        mogp.groupID         = chunk.readInt32(offset);
                        mogp.Unk2            = chunk.readInt32(offset);
                        mogp.Unk3            = chunk.readInt32(offset);

                        /* Skip 14 more bytes */
                        offset.offs += 10;

                        groupWMOObject.mogp = mogp;

                        return offset;
                    },
                    subChunks : {
                        "MOPY": function (groupWMOObject, chunk) {
                            //Materials. Ignore for now
                            var offset = {offs: 0};
                            var mopy = {};

                            var n = chunk.length / 2;
                        },
                        "MOVI": function (groupWMOObject, chunk) {
                            // Indices.
                            var indicesLen = chunk.chunkLen / 2;
                            groupWMOObject.indicies = chunk.readUint16Array({offs:0}, indicesLen);

                        },
                        "MOVT": function (groupWMOObject, chunk) {
                            if (loadPlainVertexes) {
                                groupWMOObject.verticles = chunk.readFloat32Array({offs: 0}, chunk.chunkLen/4)
                            } else {
                                var verticesLen = chunk.chunkLen/ 12;
                                groupWMOObject.verticles = chunk.readVector3f({offs: 0}, verticesLen);
                            }
                        },
                        "MONR": function (groupWMOObject, chunk) {
                            var normalsLen = chunk.chunkLen/ 12;
                            if (loadPlainVertexes) {
                                groupWMOObject.normals = chunk.readFloat32Array({offs: 0}, chunk.chunkLen/4);
                            } else {
                                groupWMOObject.normals = chunk.readVector3f({offs: 0}, normalsLen);
                            }
                        },
                        "MOTV": function (groupWMOObject, chunk) {
                            var textureCoordsLen = chunk.chunkLen / 8;

                            if (loadPlainVertexes) {
                                groupWMOObject.textCoords = chunk.readFloat32Array({offs: 0}, chunk.chunkLen/4);
                            } else {
                                groupWMOObject.textCoords = chunk.readVector2f({offs:0}, textureCoordsLen)
                            }
                        },
                        "MOCV": function (groupWMOObject, chunk) {
                            var offset = {offs : 0};
                            var cvLen = chunk.chunkLen / 4;
                            /*
                            var colorArray = [];
                            for (var i = 0; i < cvLen; i++) {
                                var color = {};
                                var b = chunk.readUint8(offset) / 255;
                                var g = chunk.readUint8(offset) / 255;
                                var r = chunk.readUint8(offset) / 255;
                                var a = chunk.readUint8(offset) / 255;

                                //colorArray.push(color);
                                colorArray.push(r);
                                colorArray.push(g);
                                colorArray.push(b);
                                colorArray.push(a);
                            } */
                            var colorArray = chunk.readInt8Array({offs:0}, chunk.chunkLen);
                            groupWMOObject.colorVerticles = colorArray;
                        },
                        "MOBA": function (groupWMOObject, chunk) {
                            var offset = {offs : 0};
                            var len = chunk.chunkLen / 24;

                            var renderBatches = [];
                            for (var i = 0; i < Math.floor(len); i++) {
                                var renderBatch = {};
                                renderBatch.unk = chunk.readUint8Array(offset, 12);

                                renderBatch.startIndex = chunk.readUint32(offset);
                                renderBatch.count      = chunk.readUint16(offset);
                                renderBatch.minIndex   = chunk.readInt16(offset);
                                renderBatch.maxIndex   = chunk.readInt16(offset);
                                renderBatch.flags      = chunk.readInt8(offset);
                                renderBatch.tex        = chunk.readUint8(offset);

                                renderBatches.push(renderBatch);
                            }

                            groupWMOObject.renderBatches = renderBatches;
                        }
                    }
                }
            };

            function BaseGroupWMOLoader() {
                var handlerTable = {
                    "MVER" : function (wmoObject, chunk) {
                        if (chunk.chunkIdent !== "MVER") {
                            throw "Got bad group WMO file " + wmoFilePath;
                        }
                        var version = chunk.readInt32({offs: 0});
                        $log.info("Loading ", wmoFilePath, ", version ", version);

                        /* Versioning */
                        if (version == 17) {
                            handlerTable = wmogroup_ver17;
                        }
                    }
                };

                this.getHandler = function (sectionName) {
                    return handlerTable[sectionName];
                }
            }

            var promise = chunkedLoader(wmoFilePath);
            promise.then(function (chunkedFile) {
                /* First chunk in file has to be MVER */

                var wmoObj = {};
                chunkedFile.processFile(wmoObj, new BaseGroupWMOLoader(), 0);

                deferred.resolve(wmoObj);
            }, function error() {
                deferred.reject();
            });

            return deferred.promise;
        }
    }]);

    /*
    * Loader for root wmo file
    * Does not contain any geometry, except bounding boxes;
    */
    wmoLoader.factory('wmoLoader', ["chunkedLoader", "fileReadHelper", "$q", '$log', function (chunkedLoader, fileReadHelper, $q, $log) {
        return function(wmoFilePath){
            var deferred = $q.defer();

            var wmo_ver17 = {
                "MOHD" : function(wmoObj, chunk) {
                    var offset = {offs: 0};
                    wmoObj.nTextures = chunk.readInt32(offset);
                    wmoObj.nGroups = chunk.readInt32(offset);
                    wmoObj.nPortals = chunk.readInt32(offset);
                    wmoObj.nLights = chunk.readInt32(offset);
                    wmoObj.nModels = chunk.readInt32(offset);
                    wmoObj.nDoodads = chunk.readInt32(offset);
                    wmoObj.nDoodadSets = chunk.readInt32(offset);
                    wmoObj.ambColor = chunk.readInt32(offset);
                    wmoObj.unk1 = chunk.readInt32(offset);

                    wmoObj.BoundBoxCorner1 = chunk.readVector3f(offset);
                    wmoObj.BoundBoxCorner2 = chunk.readVector3f(offset);

                    wmoObj.WMOId = chunk.readInt32(offset);
                },
                "MOMT": function (wmoObj, chunk) {
                    var offset = {offs: 0};
                    var textures = [];
                    var textureNames = wmoObj.motx;
                    for (var i = 0; i < wmoObj.nTextures; i++) {
                        var textureData = {};

                        textureData.flags1 = chunk.readInt32(offset);
                        textureData.flags2 = chunk.readInt32(offset);
                        textureData.blendMode = chunk.readInt32(offset);
                        textureData.namestart1 = chunk.readInt32(offset);
                        textureData.color1 = chunk.readInt32(offset);
                        textureData.flags_1 = chunk.readInt32(offset);
                        textureData.namestart2 = chunk.readInt32(offset);
                        textureData.color2 = chunk.readInt32(offset);
                        textureData.flags_2 = chunk.readInt32(offset);
                        textureData.color_3 = chunk.readInt32(offset);
                        textureData.unk = chunk.readInt32(offset);
                        textureData.dx = chunk.readInt32Array(offset, 5);

                        textureData.textureName1 = fileReadHelper(textureNames.buffer).readString({offs : textureData.namestart1}, textureNames.length);
                        textureData.textureName2 = fileReadHelper(textureNames.buffer).readString({offs : textureData.namestart2}, textureNames.length);

                        textures.push(textureData);
                    }

                    wmoObj.momt = textures;
                },
                "MOTX": function (wmoObj, chunk) {
                    var offset = {offs: 0};
                    var textureNames = chunk.readUint8Array(offset, chunk.chunkLen);

                    wmoObj.motx = textureNames;
                },
                "MODN": function (wmoObj, chunk) {
                    var offset = {offs: 0};
                    var modelNames = chunk.readUint8Array(offset, chunk.chunkLen);

                    /*
                    var m2Names = [];
                    for (var i = 0; i < wmoObj.nModels; i++) {
                        var str = chunk.readString(offset);
                        offset.offs++;
                        m2Names.push(str);
                    }     */

                    wmoObj.modn = modelNames;
                },
                "MODS": function (wmoObj, chunk) {
                    var offset = {offs: 0};
                    var doodadSets = [];

                    for (var i = 0; i < wmoObj.nDoodadSets; i++) {
                        var doodadSet = {};
                        doodadSet.name = chunk.readNZTString(offset, 20);
                        doodadSet.index = chunk.readInt32(offset);
                        doodadSet.number = chunk.readInt32(offset);
                        doodadSet.unused = chunk.readInt32(offset);

                        doodadSets.push(doodadSet);
                    }
                    wmoObj.mods = doodadSets;
                },
                "MODD" : function(wmoObj,chunk) {
                    /* Requires loaded MODS chunk. Pure parsing is not possible =(*/
                    var offset = {offs: 0};
                    var doodadsPerSet = [];
                    var modelNames = wmoObj.modn;

                    for (var i = 0; i < wmoObj.nDoodadSets; i++) {
                        var doodadSetInfo = wmoObj.mods[i];
                        var doodadSet = {
                            name : doodadSetInfo.name,
                            doodads : []
                        };

                        for (var j = 0; j < doodadSetInfo.number; j++) {
                            var doodad = {};
                            doodad.nameIndex = chunk.readInt32(offset);
                            doodad.modelName = fileReadHelper(modelNames.buffer).readString({offs : doodad.nameIndex}, modelNames.length - doodad.nameIndex);
                            doodad.pos       = chunk.readVector3f(offset);
                            doodad.rotation  = chunk.readQuaternion(offset);
                            doodad.scale     = chunk.readFloat32(offset);
                            doodad.color     = chunk.readUint32(offset);

                            doodadSet.doodads.push(doodad);
                        }

                        doodadsPerSet.push(doodadSet);
                    }

                    wmoObj.modd = doodadsPerSet;
                }
            };

            function BaseWMOLoader(){
                var handlerTable = {
                    MVER : function(wmoObject, chunk){
                        if (chunk.chunkIdent !== "MVER") {
                            throw "Got bad WMO file " + wmoFilePath;
                        }
                        var version = chunk.readInt32({offs : 0});
                        $log.info("Loading ", wmoFilePath, ", version ", version);

                        /* Versioning */
                        if (version == 17){
                            handlerTable = wmo_ver17;
                        }
                    }
                };

                this.getHandler = function(sectionName) {
                    return handlerTable[sectionName];
                }
            }

            var promise = chunkedLoader(wmoFilePath);
            promise.then(function(chunkedFile){
                /* First chunk in file has to be MVER */

                var wmoObj = {};
                chunkedFile.processFile(wmoObj, new BaseWMOLoader());

                deferred.resolve(wmoObj);
            }, function error(){
                deferred.reject();
            });

            return deferred.promise;
        };
    }]);
})(window, jQuery);
