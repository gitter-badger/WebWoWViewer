<%--
  Created by IntelliJ IDEA.
  User: Deamon
  Date: 17/01/2015
  Time: 11:10
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
    <head>
        <title></title>

        <script type="text/javascript" src="${pageContext.request.contextPath}/html/js/lib/bower/jquery/dist/jquery.js"></script>
        <script type="text/javascript" src="${pageContext.request.contextPath}/html/js/lib/bower/angular/angular.js"></script>

        <!--<script type="text/javascript" src="${pageContext.request.contextPath}/html/js/lib/webgl-debug.js"></script> -->
        <script type="text/javascript" src="${pageContext.request.contextPath}/html/js/lib/bower/stats.js/build/stats.min.js"></script>
        <script type="text/javascript" src="${pageContext.request.contextPath}/html/js/lib/bower/gl-matrix/dist/gl-matrix.js"></script>
        <script type="text/javascript" src="${pageContext.request.contextPath}/html/js/lib/bower/decodeDXT/decodeDXT.js"></script>


        <script type="text/javascript" src="${pageContext.request.contextPath}/html/js/lib/bower/text-encoding/lib/encoding-indexes.js"></script>
        <script type="text/javascript" src="${pageContext.request.contextPath}/html/js/lib/bower/text-encoding/lib/encoding.js"></script>

        <script type="text/javascript" src="${pageContext.request.contextPath}/html/js/application/angular/services/config.js"></script>
        <script type="text/javascript" src="${pageContext.request.contextPath}/html/js/application/angular/services/fileReadHelper.js"></script>
        <script type="text/javascript" src="${pageContext.request.contextPath}/html/js/application/angular/services/dbcLoader.js"></script>

        <script type="text/javascript" src="${pageContext.request.contextPath}/html/js/application/angular/services/chunkedLoader.js"></script>
        <script type="text/javascript" src="${pageContext.request.contextPath}/html/js/application/angular/services/linedfileLoader.js"></script>

        <script type="text/javascript" src="${pageContext.request.contextPath}/html/js/application/angular/services/map/adtLoader.js"></script>
        <script type="text/javascript" src="${pageContext.request.contextPath}/html/js/application/angular/services/map/wdtLoader.js"></script>
        <script type="text/javascript" src="${pageContext.request.contextPath}/html/js/application/angular/services/map/blpLoader.js"></script>
        <script type="text/javascript" src="${pageContext.request.contextPath}/html/js/application/angular/services/map/wmoLoader.js"></script>
        <script type="text/javascript" src="${pageContext.request.contextPath}/html/js/application/angular/services/map/mdxLoader.js"></script>
        <script type="text/javascript" src="${pageContext.request.contextPath}/html/js/application/angular/services/map/skinLoader.js"></script>
        <script type="text/javascript" src="${pageContext.request.contextPath}/html/js/application/angular/services/dbc/mapDBC.js"></script>

        <!-- First person camera -->
        <script type="text/javascript" src="${pageContext.request.contextPath}/html/js/application/angular/sceneJs/firstPersonCamera.js"></script>

        <!-- WoW js render -->
        <script type="text/javascript" src="${pageContext.request.contextPath}/html/js/application/angular/wowRenderJs/cache.js"></script>
        <script type="text/javascript" src="${pageContext.request.contextPath}/html/js/application/angular/wowRenderJs/scene.js"></script>
        <script type="text/javascript" src="${pageContext.request.contextPath}/html/js/application/angular/wowRenderJs/camera/firstPersonCamera.js"></script>
        <script type="text/javascript" src="${pageContext.request.contextPath}/html/js/application/angular/wowRenderJs/geometry/adtGeomCache.js"></script>
        <script type="text/javascript" src="${pageContext.request.contextPath}/html/js/application/angular/wowRenderJs/geometry/m2GeomCache.js"></script>
        <script type="text/javascript" src="${pageContext.request.contextPath}/html/js/application/angular/wowRenderJs/geometry/skinGeomCache.js"></script>
        <script type="text/javascript" src="${pageContext.request.contextPath}/html/js/application/angular/wowRenderJs/geometry/wmoGeomCache.js"></script>
        <script type="text/javascript" src="${pageContext.request.contextPath}/html/js/application/angular/wowRenderJs/geometry/wmoMainCache.js"></script>
        <script type="text/javascript" src="${pageContext.request.contextPath}/html/js/application/angular/wowRenderJs/objects/wmoObjectFactory.js"></script>
        <script type="text/javascript" src="${pageContext.request.contextPath}/html/js/application/angular/wowRenderJs/objects/mdxObject.js"></script>
        <script type="text/javascript" src="${pageContext.request.contextPath}/html/js/application/angular/wowRenderJs/objects/wmoM2ObjectFactory.js"></script>
        <script type="text/javascript" src="${pageContext.request.contextPath}/html/js/application/angular/wowRenderJs/texture/textureCache.js"></script>

        <!-- WoW js directives -->
        <script type="text/javascript" src="${pageContext.request.contextPath}/html/js/application/angular/directives/wowJsRenderDirective.js"></script>



        <script type="text/javascript" src="${pageContext.request.contextPath}/html/js/application/angular/app_wowjs.js"></script>
    </head>
    <body ng-app="main.app">

    <wow-js-render></wow-js-render>


  </body>
</html>
