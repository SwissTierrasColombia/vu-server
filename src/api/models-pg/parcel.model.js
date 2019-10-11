import PGModel from './model';

export default class ParcelModel extends PGModel {

    static async getParcelBasicInformation(dataConnection, plot_t_id, parcel_fmi, parcel_number, previous_parcel_number, property_record_card_model, valuation_model) {

        const client = await this.createClient(dataConnection);

        const schema = dataConnection.schema;

        let dataParcel = null;

        try {
            await client.connect();

            let query = "WITH" + " unidad_area_calculada_terreno AS ("
                + "    SELECT ' [' || setting || ']' FROM {schema}.t_ili2db_column_prop WHERE tablename = 'terreno' AND columnname = 'area_calculada' LIMIT 1"
                + ")," + "unidad_area_construida_uc AS ("
                + "    SELECT ' [' || setting || ']' FROM {schema}.t_ili2db_column_prop WHERE tablename = 'unidadconstruccion' AND columnname = 'area_construida' LIMIT 1"
                + ")," + "terrenos_seleccionados AS ("
                + "   SELECT {plot_t_id} AS ue_terreno WHERE '{plot_t_id}' <> 'NULL'" + "       UNION"
                + "   SELECT uebaunit.ue_terreno FROM {schema}.predio LEFT JOIN {schema}.uebaunit ON predio.t_id = uebaunit.baunit_predio  WHERE uebaunit.ue_terreno IS NOT NULL AND CASE WHEN '{parcel_fmi}' = 'NULL' THEN  1 = 2 ELSE predio.fmi = '{parcel_fmi}' END"
                + "       UNION"
                + "   SELECT uebaunit.ue_terreno FROM {schema}.predio LEFT JOIN {schema}.uebaunit ON predio.t_id = uebaunit.baunit_predio  WHERE uebaunit.ue_terreno IS NOT NULL AND CASE WHEN '{parcel_number}' = 'NULL' THEN  1 = 2 ELSE predio.numero_predial = '{parcel_number}' END"
                + "       UNION"
                + "   SELECT uebaunit.ue_terreno FROM {schema}.predio LEFT JOIN {schema}.uebaunit ON predio.t_id = uebaunit.baunit_predio  WHERE uebaunit.ue_terreno IS NOT NULL AND CASE WHEN '{previous_parcel_number}' = 'NULL' THEN  1 = 2 ELSE predio.numero_predial_anterior = '{previous_parcel_number}' END"
                + ")," + "predios_seleccionados AS ("
                + "   SELECT uebaunit.baunit_predio as t_id FROM {schema}.uebaunit WHERE uebaunit.ue_terreno = {plot_t_id} AND '{plot_t_id}' <> 'NULL'"
                + "       UNION"
                + "   SELECT t_id FROM {schema}.predio WHERE CASE WHEN '{parcel_fmi}' = 'NULL' THEN  1 = 2 ELSE predio.fmi = '{parcel_fmi}' END"
                + "       UNION"
                + "   SELECT t_id FROM {schema}.predio WHERE CASE WHEN '{parcel_number}' = 'NULL' THEN  1 = 2 ELSE predio.numero_predial = '{parcel_number}' END"
                + "       UNION"
                + "   SELECT t_id FROM {schema}.predio WHERE CASE WHEN '{previous_parcel_number}' = 'NULL' THEN  1 = 2 ELSE predio.numero_predial_anterior = '{previous_parcel_number}' END"
                + ")," + "construcciones_seleccionadas AS ("
                + "    SELECT ue_construccion FROM {schema}.uebaunit WHERE uebaunit.baunit_predio IN (SELECT predios_seleccionados.t_id FROM predios_seleccionados WHERE predios_seleccionados.t_id IS NOT NULL) AND ue_construccion IS NOT NULL"
                + ")," + "unidadesconstruccion_seleccionadas AS ("
                + "    SELECT unidadconstruccion.t_id FROM {schema}.unidadconstruccion WHERE unidadconstruccion.construccion IN (SELECT ue_construccion FROM construcciones_seleccionadas)"
                + ")," + "uc_extdireccion AS (" + "   SELECT extdireccion.unidadconstruccion_ext_direccion_id,"
                + "       json_agg(" + "               json_build_object('id', extdireccion.t_id,"
                + "                                      'attributes', json_build_object('País', extdireccion.pais,"
                + "                                                                      'Departamento', extdireccion.departamento,"
                + "                                                                      'Ciudad', extdireccion.ciudad,"
                + "                                                                      'Código postal', extdireccion.codigo_postal,"
                + "                                                                      'Apartado correo', extdireccion.apartado_correo,"
                + "                                                                      'Nombre calle', extdireccion.nombre_calle))"
                + "        ORDER BY extdireccion.t_id) FILTER(WHERE extdireccion.t_id IS NOT NULL) AS extdireccion"
                + "   FROM {schema}.extdireccion WHERE unidadconstruccion_ext_direccion_id IN (SELECT * FROM unidadesconstruccion_seleccionadas)"
                + "   GROUP BY extdireccion.unidadconstruccion_ext_direccion_id" + ")," + "info_uc AS ("
                + "    SELECT unidadconstruccion.construccion,"
                + "           json_agg(json_build_object('id', unidadconstruccion.t_id,"
                + "                             'attributes', json_build_object('Número de pisos', unidadconstruccion.numero_pisos,"
                + "                                                             CONCAT('Área construida' , (SELECT * FROM unidad_area_construida_uc)), unidadconstruccion.area_construida,";

            if (valuation_model) {
                query += "                                                 'Número de habitaciones', unidad_construccion.num_habitaciones,"
                    + "                                                 'Número de baños', unidad_construccion.num_banios,"
                    + "                                                 'Número de locales', unidad_construccion.num_locales,"
                    + "                                                 'Uso', unidad_construccion.uso,"
                    + "                                                 'Puntuación', unidad_construccion.puntuacion,";
            } else {
                query += "                                                     'Número de habitaciones', NULL,"
                    + "                                                     'Número de baños', NULL,"
                    + "                                                     'Número de locales', NULL,"
                    + "                                                     'Uso', NULL,"
                    + "                                                     'Puntuación', NULL,";
            }

            query += "                                                              'extdireccion', COALESCE(uc_extdireccion.extdireccion, '[]')"
                + "                                                             )) ORDER BY unidadconstruccion.t_id) FILTER(WHERE unidadconstruccion.t_id IS NOT NULL)  as unidadconstruccion"
                + "     FROM {schema}.unidadconstruccion LEFT JOIN uc_extdireccion ON unidadconstruccion.t_id = uc_extdireccion.unidadconstruccion_ext_direccion_id";

            if (valuation_model) {
                query += " LEFT JOIN {schema}.avaluounidadconstruccion ON unidadconstruccion.t_id = avaluounidadconstruccion.ucons"
                    + " LEFT JOIN {schema}.unidad_construccion ON avaluounidadconstruccion.aucons = unidad_construccion.t_id";
            }

            query += " WHERE unidadconstruccion.t_id IN (SELECT * FROM unidadesconstruccion_seleccionadas)"
                + "    GROUP BY unidadconstruccion.construccion" + ")," + "c_extdireccion AS ("
                + "   SELECT extdireccion.construccion_ext_direccion_id," + "       json_agg("
                + "               json_build_object('id', extdireccion.t_id,"
                + "                                      'attributes', json_build_object('País', extdireccion.pais,"
                + "                                                                      'Departamento', extdireccion.departamento,"
                + "                                                                      'Ciudad', extdireccion.ciudad,"
                + "                                                                      'Código postal', extdireccion.codigo_postal,"
                + "                                                                      'Apartado correo', extdireccion.apartado_correo,"
                + "                                                                      'Nombre calle', extdireccion.nombre_calle))"
                + "       ORDER BY extdireccion.t_id) FILTER(WHERE extdireccion.t_id IS NOT NULL) AS extdireccion"
                + "   FROM {schema}.extdireccion WHERE construccion_ext_direccion_id IN (SELECT * FROM construcciones_seleccionadas)"
                + "   GROUP BY extdireccion.construccion_ext_direccion_id" + ")," + "info_construccion as ("
                + "    SELECT uebaunit.baunit_predio,"
                + "           json_agg(json_build_object('id', construccion.t_id,"
                + "                             'attributes', json_build_object('Área construcción', construccion.area_construccion,"
                + "                                                             'extdireccion', COALESCE(c_extdireccion.extdireccion, '[]'),"
                + "                                                             'unidadconstruccion', COALESCE(info_uc.unidadconstruccion, '[]')"
                + "                                                            )) ORDER BY construccion.t_id) FILTER(WHERE construccion.t_id IS NOT NULL) as construccion"
                + "    FROM {schema}.construccion LEFT JOIN c_extdireccion ON construccion.t_id = c_extdireccion.construccion_ext_direccion_id"
                + "    LEFT JOIN info_uc ON construccion.t_id = info_uc.construccion"
                + "    LEFT JOIN {schema}.uebaunit ON uebaunit.ue_construccion = construccion.t_id"
                + "    WHERE construccion.t_id IN (SELECT * FROM construcciones_seleccionadas)"
                + "    GROUP BY uebaunit.baunit_predio" + ")," + "info_predio AS (" + "    SELECT uebaunit.ue_terreno,"
                + "           json_agg(json_build_object('id', predio.t_id,"
                + "                             'attributes', json_build_object('Nombre', predio.nombre,"
                + "                                                             'Departamento', predio.departamento,"
                + "                                                             'Municipio', predio.municipio,"
                + "                                                             'Zona', predio.zona,"
                + "                                                             'NUPRE', predio.nupre,"
                + "                                                             'FMI', predio.fmi,"
                + "                                                             'Número predial', predio.numero_predial,"
                + "                                                             'Número predial anterior', predio.numero_predial_anterior,"
                + "                                                             'Tipo', predio.tipo,";

            if (property_record_card_model) {
                query += "                                                 'Destinación económica', predio_ficha.destinacion_economica,";
            } else {
                query += "                                                 'Destinación económica', NULL,";
            }
            query += "                                                              'construccion', COALESCE(info_construccion.construccion, '[]')"
                + "                                                             )) ORDER BY predio.t_id) FILTER(WHERE predio.t_id IS NOT NULL) as predio"
                + "     FROM {schema}.predio LEFT JOIN {schema}.uebaunit ON uebaunit.baunit_predio = predio.t_id"
                + "     LEFT JOIN info_construccion ON predio.t_id = info_construccion.baunit_predio";

            if (property_record_card_model) {
                query += " LEFT JOIN {schema}.predio_ficha ON predio_ficha.crpredio = predio.t_id";
            }
            query += "     WHERE predio.t_id IN (SELECT * FROM predios_seleccionados) "
                + "  AND uebaunit.ue_terreno IS NOT NULL AND uebaunit.ue_construccion IS NULL"
                + "	 AND uebaunit.ue_unidadconstruccion IS NULL GROUP BY uebaunit.ue_terreno" + " ),"
                + " t_extdireccion AS (" + "    SELECT extdireccion.terreno_ext_direccion_id," + "        json_agg("
                + "                json_build_object('id', extdireccion.t_id,"
                + "                                       'attributes', json_build_object('País', extdireccion.pais,"
                + "                                                                       'Departamento', extdireccion.departamento,"
                + "                                                                       'Ciudad', extdireccion.ciudad,"
                + "                                                                       'Código postal', extdireccion.codigo_postal,"
                + "                                                                       'Apartado correo', extdireccion.apartado_correo,"
                + "                                                                       'Nombre calle', extdireccion.nombre_calle))"
                + "        ORDER BY extdireccion.t_id) FILTER(WHERE extdireccion.t_id IS NOT NULL) AS extdireccion"
                + "    FROM {schema}.extdireccion WHERE terreno_ext_direccion_id IN (SELECT * FROM terrenos_seleccionados)"
                + "    GROUP BY extdireccion.terreno_ext_direccion_id" + " )," + " info_terreno AS ("
                + "    SELECT terreno.t_id," + "      json_build_object('id', terreno.t_id,"
                + "                        'attributes', json_build_object(CONCAT('Área de terreno' , (SELECT * FROM unidad_area_calculada_terreno)), terreno.area_calculada,"
                + "                                                        'extdireccion', COALESCE(t_extdireccion.extdireccion, '[]'),"
                + "                                                        'predio', COALESCE(info_predio.predio, '[]')"
                + "                                                       )) as terreno"
                + "    FROM {schema}.terreno LEFT JOIN info_predio ON info_predio.ue_terreno = terreno.t_id"
                + "    LEFT JOIN t_extdireccion ON terreno.t_id = t_extdireccion.terreno_ext_direccion_id"
                + "    WHERE terreno.t_id IN (SELECT * FROM terrenos_seleccionados)" + "    ORDER BY terreno.t_id"
                + " )" + "SELECT json_agg(info_terreno.terreno) AS terreno FROM info_terreno LIMIT 1";


            query = query.replace(new RegExp('{schema}', 'g'), schema);
            query = query.replace(new RegExp('{plot_t_id}', 'g'), plot_t_id !== null ? plot_t_id : 'NULL');
            query = query.replace(new RegExp('{parcel_fmi}', 'g'), parcel_fmi !== null ? parcel_fmi : 'NULL');
            query = query.replace(new RegExp('{parcel_number}', 'g'), parcel_number !== null ? parcel_number : 'NULL');
            query = query.replace(new RegExp('{previous_parcel_number}', 'g'), previous_parcel_number !== null ? previous_parcel_number : 'NULL');

            const resultSet = await client.query(query);
            dataParcel = resultSet.rows[0].terreno;

            await client.end();
        } catch (error) {
            dataParcel = null;
        }

        return dataParcel;
    }

    static async getParcelGeometryInformation(dataConnection, parcelId) {

        const client = await this.createClient(dataConnection);

        const schema = dataConnection.schema;

        let dataParcel = null;

        try {
            await client.connect();

            const query = "select st_asgeojson(ST_Transform(t.poligono_creado, 3857)) from " + schema + ".terreno t join "
                + schema + ".uebaunit u on t.t_id=u.ue_terreno join " + schema + ".predio p on p.t_id=u.baunit_predio where p.t_id = " + parcelId;

            const resultSet = await client.query(query);

            dataParcel = JSON.parse(resultSet.rows[0].st_asgeojson);

            await client.end();

        } catch (error) {
            dataParcel = null;
        }

        return dataParcel;
    }

    static async getParcelSizes(dataConnection, parcelId) {

        const client = await this.createClient(dataConnection);

        const schema = dataConnection.schema;

        let dataParcel = null;

        try {
            await client.connect();

            const query = "select st_xmin(bbox.g) as xmin, st_ymin(bbox.g) as ymin,st_xmax(bbox.g) as xmax, st_ymax(bbox.g) as ymax from (select st_envelope(poligono_creado) as g from "
                + schema + ".vw_terreno where t_id=" + parcelId + ") bbox";

            const resultSet = await client.query(query);

            dataParcel = resultSet.rows[0];

            await client.end();

        } catch (error) {
            dataParcel = null;
        }

        return dataParcel;
    }

    static async getGeometryTerrain(dataConnection, terrainId) {

        const client = await this.createClient(dataConnection);

        const schema = dataConnection.schema;

        let dataGeometry = null;

        try {
            await client.connect();

            const query = "select st_asgeojson(ST_Transform(terreno.poligono_creado, 3857)) from " + schema + ".terreno where terreno.t_id = " + terrainId;

            const resultSet = await client.query(query);
            dataGeometry = JSON.parse(resultSet.rows[0].st_asgeojson);

            await client.end();
        } catch (error) {
            dataGeometry = null;
        }

        return dataGeometry;
    }

    static async getParcelEconomicInformation(dataConnection, plot_t_id, parcel_fmi, parcel_number, previous_parcel_number, property_record_card_model, valuation_model) {

        const client = await this.createClient(dataConnection);

        const schema = dataConnection.schema;

        let dataParcel = null;

        try {

            await client.connect();

            let query = "WITH" + "     unidad_avaluo_predio AS ("
                + "         SELECT ' [' || setting || ']' FROM {schema}.t_ili2db_column_prop WHERE tablename LIKE 'predio' AND columnname LIKE 'avaluo_predio' LIMIT 1"
                + "     )," + "     unidad_avaluo_terreno AS ("
                + "         SELECT ' [' || setting || ']' FROM {schema}.t_ili2db_column_prop WHERE tablename = 'terreno' AND columnname = 'avaluo_terreno' LIMIT 1"
                + "     )," + "     unidad_area_calculada_terreno AS ("
                + "         SELECT ' [' || setting || ']' FROM {schema}.t_ili2db_column_prop WHERE tablename = 'terreno' AND columnname = 'area_calculada' LIMIT 1"
                + "     )," + "     unidad_area_construida_uc AS ("
                + "         SELECT ' [' || setting || ']' FROM {schema}.t_ili2db_column_prop WHERE tablename = 'unidadconstruccion' AND columnname = 'area_construida' LIMIT 1"
                + "     )," + "     unidad_valor_m2_construccion_u_c AS ("
                + "         SELECT ' [' || setting || ']' FROM {schema}.t_ili2db_column_prop WHERE tablename = 'unidad_construccion' AND columnname = 'valor_m2_construccion' LIMIT 1"
                + "     )," + "     terrenos_seleccionados AS ("
                + "        SELECT {plot_t_id} AS ue_terreno WHERE '{plot_t_id}' <> 'NULL'"
                + "            UNION"
                + "        SELECT uebaunit.ue_terreno FROM {schema}.predio LEFT JOIN {schema}.uebaunit ON predio.t_id = uebaunit.baunit_predio  WHERE uebaunit.ue_terreno IS NOT NULL AND CASE WHEN '{parcel_fmi}' = 'NULL' THEN  1 = 2 ELSE predio.fmi = '{parcel_fmi}' END"
                + "            UNION"
                + "        SELECT uebaunit.ue_terreno FROM {schema}.predio LEFT JOIN {schema}.uebaunit ON predio.t_id = uebaunit.baunit_predio  WHERE uebaunit.ue_terreno IS NOT NULL AND CASE WHEN '{parcel_number}' = 'NULL' THEN  1 = 2 ELSE predio.numero_predial = '{parcel_number}' END"
                + "            UNION"
                + "        SELECT uebaunit.ue_terreno FROM {schema}.predio LEFT JOIN {schema}.uebaunit ON predio.t_id = uebaunit.baunit_predio  WHERE uebaunit.ue_terreno IS NOT NULL AND CASE WHEN '{previous_parcel_number}' = 'NULL' THEN  1 = 2 ELSE predio.numero_predial_anterior = '{previous_parcel_number}' END"
                + "     )," + "     predios_seleccionados AS ("
                + "        SELECT uebaunit.baunit_predio as t_id FROM {schema}.uebaunit WHERE uebaunit.ue_terreno = {plot_t_id} AND '{plot_t_id}' <> 'NULL'"
                + "            UNION"
                + "        SELECT t_id FROM {schema}.predio WHERE CASE WHEN '{parcel_fmi}' = 'NULL' THEN  1 = 2 ELSE predio.fmi = '{parcel_fmi}' END"
                + "            UNION"
                + "        SELECT t_id FROM {schema}.predio WHERE CASE WHEN '{parcel_number}' = 'NULL' THEN  1 = 2 ELSE predio.numero_predial = '{parcel_number}' END"
                + "            UNION"
                + "        SELECT t_id FROM {schema}.predio WHERE CASE WHEN '{previous_parcel_number}' = 'NULL' THEN  1 = 2 ELSE predio.numero_predial_anterior = '{previous_parcel_number}' END"
                + "     )," + "     construcciones_seleccionadas AS ("
                + "         SELECT ue_construccion FROM {schema}.uebaunit WHERE uebaunit.baunit_predio IN (SELECT predios_seleccionados.t_id FROM predios_seleccionados WHERE predios_seleccionados.t_id IS NOT NULL) AND ue_construccion IS NOT NULL"
                + "     )," + "     unidadesconstruccion_seleccionadas AS ("
                + "         SELECT unidadconstruccion.t_id FROM {schema}.unidadconstruccion WHERE unidadconstruccion.construccion IN (SELECT ue_construccion FROM construcciones_seleccionadas)"
                + "     ),";

            if (valuation_model) {
                query += "info_calificacion_convencional AS ("
                    + "        SELECT avaluounidadconstruccion.aucons,"
                    + "                    json_build_object('id', calificacion_convencional.t_id,"
                    + "                                           'attributes', json_build_object('Tipo calificar', calificacion_convencional.tipo_calificar"
                    + "                                                                           , 'Armazón', calificacion_convencional.armazon"
                    + "                                                                           , 'Puntos armazón', calificacion_convencional.puntos_armazon"
                    + "                                                                           , 'Muros', calificacion_convencional.muros"
                    + "                                                                           , 'Puntos muro', calificacion_convencional.puntos_muro"
                    + "                                                                           , 'Cubierta', calificacion_convencional.cubierta"
                    + "                                                                           , 'Puntos cubierta', calificacion_convencional.puntos_cubierta"
                    + "                                                                           , 'Conservación estructura', calificacion_convencional.conservacion_estructura"
                    + "                                                                           , 'Puntos estructura conservación', calificacion_convencional.puntos_estructura_conservacion"
                    + "                                                                           , 'Subtotal estructura', calificacion_convencional.sub_total_estructura"
                    + "                                                                           , 'Fachada', calificacion_convencional.fachada"
                    + "                                                                           , 'Puntos fachada', calificacion_convencional.puntos_fachada"
                    + "                                                                           , 'Cubrimientos muros', calificacion_convencional.cubrimiento_muros"
                    + "                                                                           , 'Puntos cubrimiento muros', calificacion_convencional.puntos_cubrimiento_muros"
                    + "                                                                           , 'Piso', calificacion_convencional.piso"
                    + "                                                                           , 'Puntos piso', calificacion_convencional.puntos_piso"
                    + "                                                                           , 'Conservación acabados', calificacion_convencional.conservacion_acabados"
                    + "                                                                           , 'Puntos conservación acabados', calificacion_convencional.puntos_conservacion_acabados"
                    + "                                                                           , 'Subtotal acabados', calificacion_convencional.sub_total_acabados"
                    + "                                                                           , 'Tamaño baño', calificacion_convencional.tamanio_banio"
                    + "                                                                           , 'Puntos tamaño baño', calificacion_convencional.puntos_tamanio_banio"
                    + "                                                                           , 'Enchape baño', calificacion_convencional.enchape_banio"
                    + "                                                                           , 'Puntos enchape baño', calificacion_convencional.puntos_enchape_banio"
                    + "                                                                           , 'Mobiliario baño', calificacion_convencional.mobiliario_banio"
                    + "                                                                           , 'Puntos mobiliario baño', calificacion_convencional.puntos_mobiliario_banio"
                    + "                                                                           , 'Conservación baño', calificacion_convencional.conservacion_banio"
                    + "                                                                           , 'Puntos conservación baño', calificacion_convencional.puntos_conservacion_banio"
                    + "                                                                           , 'Subtotal baño', calificacion_convencional.sub_total_banio"
                    + "                                                                           , 'Tamaño cocina', calificacion_convencional.tamanio_cocina"
                    + "                                                                           , 'Puntos tamaño cocina', calificacion_convencional.puntos_tamanio_cocina"
                    + "                                                                           , 'Enchape cocina', calificacion_convencional.enchape_cocina"
                    + "                                                                           , 'Puntos enchape cocina', calificacion_convencional.puntos_enchape_cocina"
                    + "                                                                           , 'Mobiliario cocina', calificacion_convencional.mobiliario_cocina"
                    + "                                                                           , 'Puntos mobiliario cocina', calificacion_convencional.puntos_mobiliario_cocina"
                    + "                                                                           , 'Conservación cocina', calificacion_convencional.conservacion_cocina"
                    + "                                                                           , 'Puntos conservacion cocina', calificacion_convencional.puntos_conservacion_cocina"
                    + "                                                                           , 'Subtotal cocina', calificacion_convencional.sub_total_cocina"
                    + "                                                                           , 'Total residencial y comercial', calificacion_convencional.total_residencial_y_comercial"
                    + "                                                                           , 'Cerchas', calificacion_convencional.cerchas"
                    + "                                                                           , 'Puntos cerchas', calificacion_convencional.puntos_cerchas"
                    + "                                                                           , 'Total industrial', calificacion_convencional.total_industrial))"
                    + "            AS calificacion_convencional"
                    + "        FROM {schema}.calificacion_convencional LEFT JOIN {schema}.avaluounidadconstruccion ON calificacion_convencional.unidadconstruccion = avaluounidadconstruccion.aucons"
                    + "        WHERE avaluounidadconstruccion.ucons IN (SELECT * FROM unidadesconstruccion_seleccionadas)"
                    + "        ORDER BY avaluounidadconstruccion.aucons" + "     ),"
                    + "     info_calificacion_no_convencional AS ("
                    + "        SELECT avaluounidadconstruccion.aucons,"
                    + "                    json_build_object('id', calificacion_no_convencional.t_id,"
                    + "                                           'attributes', json_build_object('Tipo de anexo', calificacion_no_convencional.tipo_anexo"
                    + "                                                                           , 'Descripción anexo', calificacion_no_convencional.descripcion_anexo"
                    + "                                                                           , 'Puntaje anexo', calificacion_no_convencional.puntaje_anexo))"
                    + "            AS calificacion_no_convencional"
                    + "        FROM {schema}.calificacion_no_convencional LEFT JOIN {schema}.avaluounidadconstruccion ON calificacion_no_convencional.unidadconstruccion = avaluounidadconstruccion.aucons"
                    + "        WHERE avaluounidadconstruccion.ucons IN (SELECT * FROM unidadesconstruccion_seleccionadas)"
                    + "        ORDER BY avaluounidadconstruccion.aucons" + "     ),";
            }

            query += " info_uc AS (" + "         SELECT unidadconstruccion.construccion,"
                + "                json_agg(json_build_object('id', unidadconstruccion.t_id,"
                + "                                  'attributes', json_build_object('Número de pisos', unidadconstruccion.numero_pisos"
                + "                                                                  , CONCAT('Área construida' , (SELECT * FROM unidad_area_construida_uc)), unidadconstruccion.area_construida";

            if (valuation_model) {
                query += ", 'Uso',  unidad_construccion.uso"
                    + "                                                                  , 'Destino económico',  unidad_construccion.destino_econo"
                    + "                                                                  , 'Tipología',  unidad_construccion.tipologia"
                    + "                                                                  , 'Puntuación',  unidad_construccion.puntuacion"
                    + "                                                                  , CONCAT('Valor m2 construcción' , (SELECT * FROM unidad_valor_m2_construccion_u_c)),  unidad_construccion.valor_m2_construccion"
                    + "                                                                  , 'Año construcción',  unidad_construccion.anio_construction"
                    + "                                                                  , 'Estado conservación',  unidad_construccion.estado_conservacion"
                    + "                                                                  , 'Número de habitaciones',  unidad_construccion.num_habitaciones"
                    + "                                                                  , 'Número de baños',  unidad_construccion.num_banios"
                    + "                                                                  , 'Número de cocinas',  unidad_construccion.num_cocinas"
                    + "                                                                  , 'Número de oficinas',  unidad_construccion.num_oficinas"
                    + "                                                                  , 'Número de estudios',  unidad_construccion.num_estudios"
                    + "                                                                  , 'Número de bodegas',  unidad_construccion.num_bodegas"
                    + "                                                                  , 'Numero de locales',  unidad_construccion.num_locales"
                    + "                                                                  , 'Número de salas',  unidad_construccion.num_salas"
                    + "                                                                  , 'Número de comedores',  unidad_construccion.num_comedores"
                    + "                                                                  , 'Material',  unidad_construccion.material"
                    + "                                                                  , 'Estilo',  unidad_construccion.estilo"
                    + "                                                                  , 'Acceso',  unidad_construccion.acceso"
                    + "                                                                  , 'nivel de acceso',  unidad_construccion.nivel_de_acceso"
                    + "                                                                  , 'Ubicación en copropiedad',  unidad_construccion.ubicacion_en_copropiedad"
                    + "                                                                  , 'Disposición',  unidad_construccion.disposicion"
                    + "                                                                  , 'Funcionalidad',  unidad_construccion.funcionalidad"
                    + "                                                                  , 'Tipo de construcción',  unidad_construccion.construccion_tipo"
                    + "                                                                  , 'Calificación', CASE WHEN info_calificacion_convencional.calificacion_convencional IS NOT NULL THEN"
                    + "                                                                                        COALESCE(info_calificacion_convencional.calificacion_convencional, '[]')"
                    + "                                                                                    ELSE"
                    + "                                                                                        COALESCE(info_calificacion_no_convencional.calificacion_no_convencional, '[]')"
                    + "                                                                                    END";
            }

            query += ")) ORDER BY unidadconstruccion.t_id) FILTER(WHERE unidadconstruccion.t_id IS NOT NULL)  as unidadconstruccion FROM {schema}.unidadconstruccion";

            if (valuation_model) {
                query += " LEFT JOIN {schema}.avaluounidadconstruccion ON unidadconstruccion.t_id = avaluounidadconstruccion.ucons"
                    + "         LEFT JOIN {schema}.unidad_construccion ON avaluounidadconstruccion.aucons = unidad_construccion.t_id"
                    + "         LEFT JOIN info_calificacion_convencional ON unidad_construccion.t_id = info_calificacion_convencional.aucons"
                    + "         LEFT JOIN info_calificacion_no_convencional ON unidad_construccion.t_id = info_calificacion_no_convencional.aucons";
            }

            query += " WHERE unidadconstruccion.t_id IN (SELECT * FROM unidadesconstruccion_seleccionadas)"
                + "         GROUP BY unidadconstruccion.construccion" + "     ),"
                + "     info_construccion as (" + "         SELECT uebaunit.baunit_predio,"
                + "                json_agg(json_build_object('id', construccion.t_id,"
                + "                                  'attributes', json_build_object('Área construcción', construccion.area_construccion,"
                + "                                                                  'unidadconstruccion', COALESCE(info_uc.unidadconstruccion, '[]')"
                + "                                                                 )) ORDER BY construccion.t_id) FILTER(WHERE construccion.t_id IS NOT NULL) as construccion"
                + "         FROM {schema}.construccion LEFT JOIN info_uc ON construccion.t_id = info_uc.construccion"
                + "         LEFT JOIN {schema}.uebaunit ON uebaunit.ue_construccion = construccion.t_id"
                + "         WHERE construccion.t_id IN (SELECT * FROM construcciones_seleccionadas)"
                + "         GROUP BY uebaunit.baunit_predio" + "     )," + "     info_predio AS ("
                + "         SELECT uebaunit.ue_terreno,"
                + "                json_agg(json_build_object('id', predio.t_id,"
                + "                                  'attributes', json_build_object('Nombre', predio.nombre,"
                + "                                                                  'Departamento', predio.departamento,"
                + "                                                                  'Municipio', predio.municipio,"
                + "                                                                  'Zona', predio.zona,"
                + "                                                                  'NUPRE', predio.nupre,"
                + "                                                                  'FMI', predio.fmi,"
                + "                                                                  'Número predial', predio.numero_predial,"
                + "                                                                  'Número predial anterior', predio.numero_predial_anterior,"
                + "                                                                  CONCAT('Avalúo predio' , (select * from unidad_avaluo_predio)), predio.avaluo_predio,"
                + "                                                                  'Tipo', predio.tipo,";

            if (property_record_card_model) {
                query += " 'Destinación económica', predio_ficha.destinacion_economica, ";
            }

            query += " 'construccion', COALESCE(info_construccion.construccion, '[]')"
                + "                                                                 )) ORDER BY predio.t_id) FILTER(WHERE predio.t_id IS NOT NULL) as predio"
                + "         FROM {schema}.predio LEFT JOIN {schema}.uebaunit ON uebaunit.baunit_predio = predio.t_id"
                + "         LEFT JOIN info_construccion ON predio.t_id = info_construccion.baunit_predio ";

            if (property_record_card_model) {
                query += " LEFT JOIN {schema}.predio_ficha ON predio_ficha.crpredio = predio.t_id";
            }

            query += " WHERE predio.t_id IN (SELECT * FROM predios_seleccionados) "
                + "         AND uebaunit.ue_terreno IS NOT NULL"
                + "		 AND uebaunit.ue_construccion IS NULL"
                + "		 AND uebaunit.ue_unidadconstruccion IS NULL"
                + "		 GROUP BY uebaunit.ue_terreno" + "     ),";

            if (valuation_model) {
                query += " info_zona_homogenea_geoeconomica AS (" + "        SELECT terreno.t_id,"
                    + "            json_agg("
                    + "                    json_build_object('id', zona_homogenea_geoeconomica.t_id,"
                    + "                                           'attributes', json_build_object('Porcentaje', ROUND((st_area(st_intersection(terreno.poligono_creado, zona_homogenea_geoeconomica.geometria))/ st_area(terreno.poligono_creado))::numeric * 100,2),"
                    + "                                                                           'Valor', zona_homogenea_geoeconomica.valor,"
                    + "                                                                           'Identificador', zona_homogenea_geoeconomica.identificador))"
                    + "            ORDER BY zona_homogenea_geoeconomica.t_id) FILTER(WHERE zona_homogenea_geoeconomica.t_id IS NOT NULL) AS zona_homogenea_geoeconomica"
                    + "        FROM {schema}.terreno, {schema}.zona_homogenea_geoeconomica"
                    + "        WHERE terreno.t_id IN (SELECT * FROM terrenos_seleccionados) AND"
                    + "              st_intersects(terreno.poligono_creado, zona_homogenea_geoeconomica.geometria) = True AND"
                    + "              st_area(st_intersection(terreno.poligono_creado, zona_homogenea_geoeconomica.geometria)) > 0"
                    + "        GROUP BY terreno.t_id" + "     ),"
                    + "     info_zona_homogenea_fisica AS (" + "        SELECT terreno.t_id,"
                    + "            json_agg("
                    + "                    json_build_object('id', zona_homogenea_fisica.t_id,"
                    + "                                           'attributes', json_build_object('Porcentaje', ROUND((st_area(st_intersection(terreno.poligono_creado, zona_homogenea_fisica.geometria))/ st_area(terreno.poligono_creado))::numeric * 100, 2),"
                    + "                                                                           'Identificador', zona_homogenea_fisica.identificador))"
                    + "            ORDER BY zona_homogenea_fisica.t_id) FILTER(WHERE zona_homogenea_fisica.t_id IS NOT NULL) AS zona_homogenea_fisica"
                    + "        FROM {schema}.terreno, {schema}.zona_homogenea_fisica"
                    + "        WHERE terreno.t_id IN (SELECT * FROM terrenos_seleccionados) AND"
                    + "              st_intersects(terreno.poligono_creado, zona_homogenea_fisica.geometria) = True AND"
                    + "              st_area(st_intersection(terreno.poligono_creado, zona_homogenea_fisica.geometria)) > 0"
                    + "        GROUP BY terreno.t_id" + "     ),";

            }

            query += " info_terreno AS (" + "        SELECT terreno.t_id,"
                + "          json_build_object('id', terreno.t_id,"
                + "                            'attributes', json_build_object(CONCAT('Área de terreno' , (SELECT * FROM unidad_area_calculada_terreno)), terreno.area_calculada"
                + "                                                            , CONCAT('Avalúo terreno', (SELECT * FROM unidad_avaluo_terreno)), terreno.Avaluo_Terreno";

            if (valuation_model) {
                query += ", 'zona_homogenea_geoeconomica', COALESCE(info_zona_homogenea_geoeconomica.zona_homogenea_geoeconomica, '[]')"
                    + "                                                            , 'zona_homogenea_fisica', COALESCE(info_zona_homogenea_fisica.zona_homogenea_fisica, '[]')";

            }

            query += ", 'predio', COALESCE(info_predio.predio, '[]'))) as terreno FROM {schema}.terreno LEFT JOIN info_predio ON info_predio.ue_terreno = terreno.t_id";

            if (valuation_model) {
                query += " LEFT JOIN info_zona_homogenea_geoeconomica ON info_zona_homogenea_geoeconomica.t_id = terreno.t_id"
                    + "        LEFT JOIN info_zona_homogenea_fisica ON info_zona_homogenea_fisica.t_id = terreno.t_id";
            }

            query += " WHERE terreno.t_id IN (SELECT * FROM terrenos_seleccionados) ORDER BY terreno.t_id ) SELECT json_agg(info_terreno.terreno) AS terreno FROM info_terreno";

            query = query.replace(new RegExp('{schema}', 'g'), schema);
            query = query.replace(new RegExp('{plot_t_id}', 'g'), plot_t_id !== null ? plot_t_id : 'NULL');
            query = query.replace(new RegExp('{parcel_fmi}', 'g'), parcel_fmi !== null ? parcel_fmi : 'NULL');
            query = query.replace(new RegExp('{parcel_number}', 'g'), parcel_number !== null ? parcel_number : 'NULL');
            query = query.replace(new RegExp('{previous_parcel_number}', 'g'), previous_parcel_number !== null ? previous_parcel_number : 'NULL');

            const resultSet = await client.query(query);

            dataParcel = resultSet.rows[0].terreno;

            await client.end();

        } catch (error) {
            dataParcel = null;
        }

        return dataParcel;

    }

    static async getParcelLegalInformation(dataConnection, plot_t_id, parcel_fmi, parcel_number, previous_parcel_number) {

        const client = await this.createClient(dataConnection);

        const schema = dataConnection.schema;

        let dataParcel = null;

        try {

            await client.connect();

            let query = "WITH" + "     unidad_area_calculada_terreno AS ("
                + "         SELECT ' [' || setting || ']' FROM {schema}.t_ili2db_column_prop WHERE tablename = 'terreno' AND columnname = 'area_calculada' LIMIT 1"
                + "     )," + "     terrenos_seleccionados AS ("
                + "        SELECT {plot_t_id} AS ue_terreno WHERE '{plot_t_id}' <> 'NULL'"
                + "            UNION"
                + "        SELECT uebaunit.ue_terreno FROM {schema}.predio LEFT JOIN {schema}.uebaunit ON predio.t_id = uebaunit.baunit_predio  WHERE uebaunit.ue_terreno IS NOT NULL AND CASE WHEN '{parcel_fmi}' = 'NULL' THEN  1 = 2 ELSE predio.fmi = '{parcel_fmi}' END"
                + "            UNION"
                + "        SELECT uebaunit.ue_terreno FROM {schema}.predio LEFT JOIN {schema}.uebaunit ON predio.t_id = uebaunit.baunit_predio  WHERE uebaunit.ue_terreno IS NOT NULL AND CASE WHEN '{parcel_number}' = 'NULL' THEN  1 = 2 ELSE predio.numero_predial = '{parcel_number}' END"
                + "            UNION"
                + "        SELECT uebaunit.ue_terreno FROM {schema}.predio LEFT JOIN {schema}.uebaunit ON predio.t_id = uebaunit.baunit_predio  WHERE uebaunit.ue_terreno IS NOT NULL AND CASE WHEN '{previous_parcel_number}' = 'NULL' THEN  1 = 2 ELSE predio.numero_predial_anterior = '{previous_parcel_number}' END"
                + "     )," + "     predios_seleccionados AS ("
                + "        SELECT uebaunit.baunit_predio as t_id FROM {schema}.uebaunit WHERE uebaunit.ue_terreno = {plot_t_id} AND '{plot_t_id}' <> 'NULL'"
                + "            UNION"
                + "        SELECT t_id FROM {schema}.predio WHERE CASE WHEN '{parcel_fmi}' = 'NULL' THEN  1 = 2 ELSE predio.fmi = '{parcel_fmi}' END"
                + "            UNION"
                + "        SELECT t_id FROM {schema}.predio WHERE CASE WHEN '{parcel_number}' = 'NULL' THEN  1 = 2 ELSE predio.numero_predial = '{parcel_number}' END"
                + "            UNION"
                + "        SELECT t_id FROM {schema}.predio WHERE CASE WHEN '{previous_parcel_number}' = 'NULL' THEN  1 = 2 ELSE predio.numero_predial_anterior = '{previous_parcel_number}' END"
                + "     )," + "     derechos_seleccionados AS ("
                + "         SELECT DISTINCT col_derecho.t_id FROM {schema}.col_derecho WHERE col_derecho.unidad_predio IN (SELECT * FROM predios_seleccionados)"
                + "     )," + "     derecho_interesados AS ("
                + "         SELECT DISTINCT col_derecho.interesado_col_interesado, col_derecho.t_id FROM {schema}.col_derecho WHERE col_derecho.t_id IN (SELECT * FROM derechos_seleccionados) AND col_derecho.interesado_col_interesado IS NOT NULL"
                + "     )," + "     derecho_agrupacion_interesados AS ("
                + "         SELECT DISTINCT col_derecho.interesado_la_agrupacion_interesados, miembros.interesados_col_interesado"
                + "         FROM {schema}.col_derecho LEFT JOIN {schema}.miembros ON col_derecho.interesado_la_agrupacion_interesados = miembros.agrupacion"
                + "         WHERE col_derecho.t_id IN (SELECT * FROM derechos_seleccionados) AND col_derecho.interesado_la_agrupacion_interesados IS NOT NULL"
                + "     )," + "      restricciones_seleccionadas AS ("
                + "         SELECT DISTINCT col_restriccion.t_id FROM {schema}.col_restriccion WHERE col_restriccion.unidad_predio IN (SELECT * FROM predios_seleccionados)"
                + "     )," + "     restriccion_interesados AS ("
                + "         SELECT DISTINCT col_restriccion.interesado_col_interesado, col_restriccion.t_id FROM {schema}.col_restriccion WHERE col_restriccion.t_id IN (SELECT * FROM restricciones_seleccionadas) AND col_restriccion.interesado_col_interesado IS NOT NULL"
                + "     )," + "     restriccion_agrupacion_interesados AS ("
                + "         SELECT DISTINCT col_restriccion.interesado_la_agrupacion_interesados, miembros.interesados_col_interesado"
                + "         FROM {schema}.col_restriccion LEFT JOIN {schema}.miembros ON col_restriccion.interesado_la_agrupacion_interesados = miembros.agrupacion"
                + "         WHERE col_restriccion.t_id IN (SELECT * FROM restricciones_seleccionadas) AND col_restriccion.interesado_la_agrupacion_interesados IS NOT NULL"
                + "     )," + "     responsabilidades_seleccionadas AS ("
                + "         SELECT DISTINCT col_responsabilidad.t_id FROM {schema}.col_responsabilidad WHERE col_responsabilidad.unidad_predio IN (SELECT * FROM predios_seleccionados)"
                + "     )," + "     responsabilidades_interesados AS ("
                + "         SELECT DISTINCT col_responsabilidad.interesado_col_interesado, col_responsabilidad.t_id FROM {schema}.col_responsabilidad WHERE col_responsabilidad.t_id IN (SELECT * FROM responsabilidades_seleccionadas) AND col_responsabilidad.interesado_col_interesado IS NOT NULL"
                + "     )," + "     responsabilidades_agrupacion_interesados AS ("
                + "         SELECT DISTINCT col_responsabilidad.interesado_la_agrupacion_interesados, miembros.interesados_col_interesado"
                + "         FROM {schema}.col_responsabilidad LEFT JOIN {schema}.miembros ON col_responsabilidad.interesado_la_agrupacion_interesados = miembros.agrupacion"
                + "         WHERE col_responsabilidad.t_id IN (SELECT * FROM responsabilidades_seleccionadas) AND col_responsabilidad.interesado_la_agrupacion_interesados IS NOT NULL"
                + "     )," + "     hipotecas_seleccionadas AS ("
                + "         SELECT DISTINCT col_hipoteca.t_id FROM {schema}.col_hipoteca WHERE col_hipoteca.unidad_predio IN (SELECT * FROM predios_seleccionados)"
                + "     )," + "     hipotecas_interesados AS ("
                + "         SELECT DISTINCT col_hipoteca.interesado_col_interesado, col_hipoteca.t_id FROM {schema}.col_hipoteca WHERE col_hipoteca.t_id IN (SELECT * FROM hipotecas_seleccionadas) AND col_hipoteca.interesado_col_interesado IS NOT NULL"
                + "     )," + "     hipotecas_agrupacion_interesados AS ("
                + "         SELECT DISTINCT col_hipoteca.interesado_la_agrupacion_interesados, miembros.interesados_col_interesado"
                + "         FROM {schema}.col_hipoteca LEFT JOIN {schema}.miembros ON col_hipoteca.interesado_la_agrupacion_interesados = miembros.agrupacion"
                + "         WHERE col_hipoteca.t_id IN (SELECT * FROM hipotecas_seleccionadas) AND col_hipoteca.interesado_la_agrupacion_interesados IS NOT NULL"
                + "     )," + "     info_contacto_interesados_derecho AS ("
                + "            SELECT interesado_contacto.interesado," + "              json_agg("
                + "                    json_build_object('id', interesado_contacto.t_id,"
                + "                                           'attributes', json_build_object('Teléfono 1', interesado_contacto.telefono1,"
                + "                                                                           'Teléfono 2', interesado_contacto.telefono2,"
                + "                                                                           'Domicilio notificación', interesado_contacto.domicilio_notificacion,"
                + "                                                                           'Correo_Electrónico', interesado_contacto.correo_electronico,"
                + "                                                                           'Origen_de_datos', interesado_contacto.origen_datos)) ORDER BY interesado_contacto.t_id)"
                + "            FILTER(WHERE interesado_contacto.t_id IS NOT NULL) AS interesado_contacto"
                + "            FROM {schema}.interesado_contacto"
                + "            WHERE interesado_contacto.interesado IN (SELECT derecho_interesados.interesado_col_interesado FROM derecho_interesados)"
                + "            GROUP BY interesado_contacto.interesado" + "     ),"
                + "     info_interesados_derecho AS (" + "         SELECT derecho_interesados.t_id,"
                + "          json_agg(" + "            json_build_object('id', col_interesado.t_id,"
                + "                              'attributes', json_build_object('Tipo', col_interesado.tipo,"
                + "                                                              col_interesadodocumentotipo.dispname, col_interesado.documento_identidad,"
                + "                                                              'Nombre', col_interesado.nombre,"
                + "                                                              CASE WHEN col_interesado.tipo = 'Persona_No_Natural' THEN 'Tipo interesado jurídico' ELSE 'Género' END, CASE WHEN col_interesado.tipo = 'Persona_No_Natural' THEN col_interesado.tipo_interesado_juridico ELSE col_interesado.genero END,"
                + "                                                              'interesado_contacto', COALESCE(info_contacto_interesados_derecho.interesado_contacto, '[]')))"
                + "         ORDER BY col_interesado.t_id) FILTER (WHERE col_interesado.t_id IS NOT NULL) AS col_interesado"
                + "         FROM derecho_interesados LEFT JOIN {schema}.col_interesado ON col_interesado.t_id = derecho_interesados.interesado_col_interesado"
                + "         LEFT JOIN {schema}.col_interesadodocumentotipo ON col_interesadodocumentotipo.ilicode = col_interesado.tipo_documento"
                + "         LEFT JOIN info_contacto_interesados_derecho ON info_contacto_interesados_derecho.interesado = col_interesado.t_id"
                + "         GROUP BY derecho_interesados.t_id" + "     ),"
                + "     info_contacto_interesado_agrupacion_interesados_derecho AS ("
                + "            SELECT interesado_contacto.interesado," + "              json_agg("
                + "                    json_build_object('id', interesado_contacto.t_id,"
                + "                                           'attributes', json_build_object('Teléfono 1', interesado_contacto.telefono1,"
                + "                                                                           'Teléfono 2', interesado_contacto.telefono2,"
                + "                                                                           'Domicilio notificación', interesado_contacto.domicilio_notificacion,"
                + "                                                                           'Correo_Electrónico', interesado_contacto.correo_electronico,"
                + "                                                                           'Origen_de_datos', interesado_contacto.origen_datos)) ORDER BY interesado_contacto.t_id)"
                + "            FILTER(WHERE interesado_contacto.t_id IS NOT NULL) AS interesado_contacto"
                + "            FROM {schema}.interesado_contacto LEFT JOIN derecho_interesados ON derecho_interesados.interesado_col_interesado = interesado_contacto.interesado"
                + "            WHERE interesado_contacto.interesado IN (SELECT DISTINCT derecho_agrupacion_interesados.interesados_col_interesado FROM derecho_agrupacion_interesados)"
                + "            GROUP BY interesado_contacto.interesado" + "     ),"
                + "     info_interesados_agrupacion_interesados_derecho AS ("
                + "         SELECT derecho_agrupacion_interesados.interesado_la_agrupacion_interesados,"
                + "          json_agg(" + "            json_build_object('id', col_interesado.t_id,"
                + "                              'attributes', json_build_object(col_interesadodocumentotipo.dispname, col_interesado.documento_identidad,"
                + "                                                              'Nombre', col_interesado.nombre,"
                + "                                                              CASE WHEN col_interesado.tipo = 'Persona_No_Natural' THEN 'Tipo interesado jurídico' ELSE 'Género' END, CASE WHEN col_interesado.tipo = 'Persona_No_Natural' THEN col_interesado.tipo_interesado_juridico ELSE col_interesado.genero END,"
                + "                                                              'interesado_contacto', COALESCE(info_contacto_interesado_agrupacion_interesados_derecho.interesado_contacto, '[]'),"
                + "                                                              'fraccion', ROUND((fraccion.numerador::numeric/fraccion.denominador::numeric)*100,2) ))"
                + "         ORDER BY col_interesado.t_id) FILTER (WHERE col_interesado.t_id IS NOT NULL) AS col_interesado"
                + "         FROM derecho_agrupacion_interesados LEFT JOIN {schema}.col_interesado ON col_interesado.t_id = derecho_agrupacion_interesados.interesados_col_interesado"
                + "         LEFT JOIN {schema}.col_interesadodocumentotipo ON col_interesadodocumentotipo.ilicode = col_interesado.tipo_documento"
                + "         LEFT JOIN info_contacto_interesado_agrupacion_interesados_derecho ON info_contacto_interesado_agrupacion_interesados_derecho.interesado = col_interesado.t_id"
                + "         LEFT JOIN {schema}.miembros ON (miembros.agrupacion::text || miembros.interesados_col_interesado::text) = (derecho_agrupacion_interesados.interesado_la_agrupacion_interesados::text|| col_interesado.t_id::text)"
                + "         LEFT JOIN {schema}.fraccion ON miembros.t_id = fraccion.miembros_participacion"
                + "         GROUP BY derecho_agrupacion_interesados.interesado_la_agrupacion_interesados"
                + "     )," + "     info_agrupacion_interesados AS ("
                + "         SELECT col_derecho.t_id," + "         json_agg("
                + "            json_build_object('id', la_agrupacion_interesados.t_id,"
                + "                              'attributes', json_build_object('Tipo de agrupación de interesados', la_agrupacion_interesados.ai_tipo,"
                + "                                                              'Nombre', la_agrupacion_interesados.nombre,"
                + "                                                              'col_interesado', COALESCE(info_interesados_agrupacion_interesados_derecho.col_interesado, '[]')))"
                + "         ORDER BY la_agrupacion_interesados.t_id) FILTER (WHERE la_agrupacion_interesados.t_id IS NOT NULL) AS la_agrupacion_interesados"
                + "         FROM {schema}.la_agrupacion_interesados LEFT JOIN {schema}.col_derecho ON la_agrupacion_interesados.t_id = col_derecho.interesado_la_agrupacion_interesados"
                + "         LEFT JOIN info_interesados_agrupacion_interesados_derecho ON info_interesados_agrupacion_interesados_derecho.interesado_la_agrupacion_interesados = la_agrupacion_interesados.t_id"
                + "         WHERE la_agrupacion_interesados.t_id IN (SELECT DISTINCT derecho_agrupacion_interesados.interesado_la_agrupacion_interesados FROM derecho_agrupacion_interesados)"
                + "         AND col_derecho.t_id IN (SELECT derechos_seleccionados.t_id FROM derechos_seleccionados)"
                + "         GROUP BY col_derecho.t_id" + "     ),"
                + "     info_fuentes_administrativas_derecho AS (" + "        SELECT col_derecho.t_id,"
                + "         json_agg("
                + "            json_build_object('id', col_fuenteadministrativa.t_id,"
                + "                              'attributes', json_build_object('Tipo de fuente administrativa', col_fuenteadministrativa.tipo,"
                + "                                                              'Nombre', col_fuenteadministrativa.nombre,"
                + "                                                              'Estado disponibilidad', col_fuenteadministrativa.estado_disponibilidad,"
                + "                                                              'Archivo fuente', extarchivo.datos))"
                + "         ORDER BY col_fuenteadministrativa.t_id) FILTER (WHERE col_fuenteadministrativa.t_id IS NOT NULL) AS col_fuenteadministrativa"
                + "        FROM {schema}.col_derecho"
                + "        LEFT JOIN {schema}.rrrfuente ON col_derecho.t_id = rrrfuente.rrr_col_derecho"
                + "        LEFT JOIN {schema}.col_fuenteadministrativa ON rrrfuente.rfuente = col_fuenteadministrativa.t_id"
                + "        LEFT JOIN {schema}.extarchivo ON extarchivo.col_fuenteadminstrtiva_ext_archivo_id = col_fuenteadministrativa.t_id"
                + "        WHERE col_derecho.t_id IN (SELECT derechos_seleccionados.t_id FROM derechos_seleccionados)"
                + "        GROUP BY col_derecho.t_id" + "     )," + "    info_derecho AS ("
                + "      SELECT col_derecho.unidad_predio," + "        json_agg("
                + "            json_build_object('id', col_derecho.t_id,"
                + "                              'attributes', json_build_object('Tipo de derecho', col_derecho.tipo,"
                + "                                                              'Código registral', col_derecho.codigo_registral_derecho,"
                + "                                                              'Descripción', col_derecho.descripcion,"
                + "                                                              'col_fuenteadministrativa', COALESCE(info_fuentes_administrativas_derecho.col_fuenteadministrativa, '[]'),"
                + "                                                              CASE WHEN info_agrupacion_interesados.la_agrupacion_interesados IS NOT NULL THEN 'la_agrupacion_interesados' ELSE 'col_interesado' END, CASE WHEN info_agrupacion_interesados.la_agrupacion_interesados IS NOT NULL THEN COALESCE(info_agrupacion_interesados.la_agrupacion_interesados, '[]') ELSE COALESCE(info_interesados_derecho.col_interesado, '[]') END))"
                + "         ORDER BY col_derecho.t_id) FILTER (WHERE col_derecho.t_id IS NOT NULL) AS col_derecho"
                + "      FROM {schema}.col_derecho LEFT JOIN info_fuentes_administrativas_derecho ON col_derecho.t_id = info_fuentes_administrativas_derecho.t_id"
                + "      LEFT JOIN info_interesados_derecho ON col_derecho.t_id = info_interesados_derecho.t_id"
                + "      LEFT JOIN info_agrupacion_interesados ON col_derecho.t_id = info_agrupacion_interesados.t_id"
                + "      WHERE col_derecho.t_id IN (SELECT * FROM derechos_seleccionados)"
                + "      GROUP BY col_derecho.unidad_predio" + "    ),"
                + "     info_contacto_interesados_restriccion AS ("
                + "            SELECT interesado_contacto.interesado," + "              json_agg("
                + "                    json_build_object('id', interesado_contacto.t_id,"
                + "                                           'attributes', json_build_object('Teléfono 1', interesado_contacto.telefono1,"
                + "                                                                           'Teléfono 2', interesado_contacto.telefono2,"
                + "                                                                           'Domicilio notificación', interesado_contacto.domicilio_notificacion,"
                + "                                                                           'Correo_Electrónico', interesado_contacto.correo_electronico,"
                + "                                                                           'Origen_de_datos', interesado_contacto.origen_datos)) ORDER BY interesado_contacto.t_id)"
                + "            FILTER(WHERE interesado_contacto.t_id IS NOT NULL) AS interesado_contacto"
                + "            FROM {schema}.interesado_contacto"
                + "            WHERE interesado_contacto.interesado IN (SELECT restriccion_interesados.interesado_col_interesado FROM restriccion_interesados)"
                + "            GROUP BY interesado_contacto.interesado" + "     ),"
                + "     info_interesados_restriccion AS ("
                + "         SELECT restriccion_interesados.t_id," + "          json_agg("
                + "            json_build_object('id', col_interesado.t_id,"
                + "                              'attributes', json_build_object('Tipo', col_interesado.tipo,"
                + "                                                              col_interesadodocumentotipo.dispname, col_interesado.documento_identidad,"
                + "                                                              'Nombre', col_interesado.nombre,"
                + "                                                              CASE WHEN col_interesado.tipo = 'Persona_No_Natural' THEN 'Tipo interesado jurídico' ELSE 'Género' END, CASE WHEN col_interesado.tipo = 'Persona_No_Natural' THEN col_interesado.tipo_interesado_juridico ELSE col_interesado.genero END,"
                + "                                                              'interesado_contacto', COALESCE(info_contacto_interesados_restriccion.interesado_contacto, '[]')))"
                + "         ORDER BY col_interesado.t_id) FILTER (WHERE col_interesado.t_id IS NOT NULL) AS col_interesado"
                + "         FROM restriccion_interesados LEFT JOIN {schema}.col_interesado ON col_interesado.t_id = restriccion_interesados.interesado_col_interesado"
                + "         LEFT JOIN {schema}.col_interesadodocumentotipo ON col_interesadodocumentotipo.ilicode = col_interesado.tipo_documento"
                + "         LEFT JOIN info_contacto_interesados_restriccion ON info_contacto_interesados_restriccion.interesado = col_interesado.t_id"
                + "         GROUP BY restriccion_interesados.t_id" + "     ),"
                + "     info_contacto_interesado_agrupacion_interesados_restriccion AS ("
                + "            SELECT interesado_contacto.interesado," + "              json_agg("
                + "                    json_build_object('id', interesado_contacto.t_id,"
                + "                                           'attributes', json_build_object('Teléfono 1', interesado_contacto.telefono1,"
                + "                                                                           'Teléfono 2', interesado_contacto.telefono2,"
                + "                                                                           'Domicilio notificación', interesado_contacto.domicilio_notificacion,"
                + "                                                                           'Correo_Electrónico', interesado_contacto.correo_electronico,"
                + "                                                                           'Origen_de_datos', interesado_contacto.origen_datos)) ORDER BY interesado_contacto.t_id)"
                + "            FILTER(WHERE interesado_contacto.t_id IS NOT NULL) AS interesado_contacto"
                + "            FROM {schema}.interesado_contacto LEFT JOIN restriccion_interesados ON restriccion_interesados.interesado_col_interesado = interesado_contacto.interesado"
                + "            WHERE interesado_contacto.interesado IN (SELECT DISTINCT restriccion_agrupacion_interesados.interesados_col_interesado FROM restriccion_agrupacion_interesados)"
                + "            GROUP BY interesado_contacto.interesado" + "     ),"
                + "     info_interesados_agrupacion_interesados_restriccion AS ("
                + "         SELECT restriccion_agrupacion_interesados.interesado_la_agrupacion_interesados,"
                + "          json_agg(" + "            json_build_object('id', col_interesado.t_id,"
                + "                              'attributes', json_build_object(col_interesadodocumentotipo.dispname, col_interesado.documento_identidad,"
                + "                                                              'Nombre', col_interesado.nombre,"
                + "                                                              CASE WHEN col_interesado.tipo = 'Persona_No_Natural' THEN 'Tipo interesado jurídico' ELSE 'Género' END, CASE WHEN col_interesado.tipo = 'Persona_No_Natural' THEN col_interesado.tipo_interesado_juridico ELSE col_interesado.genero END,"
                + "                                                              'interesado_contacto', COALESCE(info_contacto_interesado_agrupacion_interesados_restriccion.interesado_contacto, '[]'),"
                + "                                                              'fraccion', ROUND((fraccion.numerador::numeric/fraccion.denominador::numeric)*100,2) ))"
                + "         ORDER BY col_interesado.t_id) FILTER (WHERE col_interesado.t_id IS NOT NULL) AS col_interesado"
                + "         FROM restriccion_agrupacion_interesados LEFT JOIN {schema}.col_interesado ON col_interesado.t_id = restriccion_agrupacion_interesados.interesados_col_interesado"
                + "         LEFT JOIN {schema}.col_interesadodocumentotipo ON col_interesadodocumentotipo.ilicode = col_interesado.tipo_documento"
                + "         LEFT JOIN info_contacto_interesado_agrupacion_interesados_restriccion ON info_contacto_interesado_agrupacion_interesados_restriccion.interesado = col_interesado.t_id"
                + "         LEFT JOIN {schema}.miembros ON (miembros.agrupacion::text || miembros.interesados_col_interesado::text) = (restriccion_agrupacion_interesados.interesado_la_agrupacion_interesados::text|| col_interesado.t_id::text)"
                + "         LEFT JOIN {schema}.fraccion ON miembros.t_id = fraccion.miembros_participacion"
                + "         GROUP BY restriccion_agrupacion_interesados.interesado_la_agrupacion_interesados"
                + "     )," + "     info_agrupacion_interesados_restriccion AS ("
                + "         SELECT col_restriccion.t_id," + "         json_agg("
                + "            json_build_object('id', la_agrupacion_interesados.t_id,"
                + "                              'attributes', json_build_object('Tipo de agrupación de interesados', la_agrupacion_interesados.ai_tipo,"
                + "                                                              'Nombre', la_agrupacion_interesados.nombre,"
                + "                                                              'col_interesado', COALESCE(info_interesados_agrupacion_interesados_restriccion.col_interesado, '[]')))"
                + "         ORDER BY la_agrupacion_interesados.t_id) FILTER (WHERE la_agrupacion_interesados.t_id IS NOT NULL) AS la_agrupacion_interesados"
                + "         FROM {schema}.la_agrupacion_interesados LEFT JOIN {schema}.col_restriccion ON la_agrupacion_interesados.t_id = col_restriccion.interesado_la_agrupacion_interesados"
                + "         LEFT JOIN info_interesados_agrupacion_interesados_restriccion ON info_interesados_agrupacion_interesados_restriccion.interesado_la_agrupacion_interesados = la_agrupacion_interesados.t_id"
                + "         WHERE la_agrupacion_interesados.t_id IN (SELECT DISTINCT restriccion_agrupacion_interesados.interesado_la_agrupacion_interesados FROM restriccion_agrupacion_interesados)"
                + "         AND col_restriccion.t_id IN (SELECT restricciones_seleccionadas.t_id FROM restricciones_seleccionadas)"
                + "         GROUP BY col_restriccion.t_id" + "     ),"
                + "     info_fuentes_administrativas_restriccion AS ("
                + "        SELECT col_restriccion.t_id," + "         json_agg("
                + "            json_build_object('id', col_fuenteadministrativa.t_id,"
                + "                              'attributes', json_build_object('Tipo de fuente administrativa', col_fuenteadministrativa.tipo,"
                + "                                                              'Nombre', col_fuenteadministrativa.nombre,"
                + "                                                              'Estado disponibilidad', col_fuenteadministrativa.estado_disponibilidad,"
                + "                                                              'Archivo fuente', extarchivo.datos))"
                + "         ORDER BY col_fuenteadministrativa.t_id) FILTER (WHERE col_fuenteadministrativa.t_id IS NOT NULL) AS col_fuenteadministrativa"
                + "        FROM {schema}.col_restriccion"
                + "        LEFT JOIN {schema}.rrrfuente ON col_restriccion.t_id = rrrfuente.rrr_col_restriccion"
                + "        LEFT JOIN {schema}.col_fuenteadministrativa ON rrrfuente.rfuente = col_fuenteadministrativa.t_id"
                + "        LEFT JOIN {schema}.extarchivo ON extarchivo.col_fuenteadminstrtiva_ext_archivo_id = col_fuenteadministrativa.t_id"
                + "        WHERE col_restriccion.t_id IN (SELECT restricciones_seleccionadas.t_id FROM restricciones_seleccionadas)"
                + "        GROUP BY col_restriccion.t_id" + "     )," + "    info_restriccion AS ("
                + "      SELECT col_restriccion.unidad_predio," + "        json_agg("
                + "            json_build_object('id', col_restriccion.t_id,"
                + "                              'attributes', json_build_object('Tipo de restricción', col_restriccion.tipo,"
                + "                                                              'Código registral', col_restriccion.codigo_registral_restriccion,"
                + "                                                              'Descripción', col_restriccion.descripcion,"
                + "                                                              'col_fuenteadministrativa', COALESCE(info_fuentes_administrativas_restriccion.col_fuenteadministrativa, '[]'),"
                + "                                                              CASE WHEN info_agrupacion_interesados_restriccion.la_agrupacion_interesados IS NOT NULL THEN 'la_agrupacion_interesados' ELSE 'col_interesado' END, CASE WHEN info_agrupacion_interesados_restriccion.la_agrupacion_interesados IS NOT NULL THEN COALESCE(info_agrupacion_interesados_restriccion.la_agrupacion_interesados, '[]') ELSE COALESCE(info_interesados_restriccion.col_interesado, '[]') END))"
                + "         ORDER BY col_restriccion.t_id) FILTER (WHERE col_restriccion.t_id IS NOT NULL) AS col_restriccion"
                + "      FROM {schema}.col_restriccion LEFT JOIN info_fuentes_administrativas_restriccion ON col_restriccion.t_id = info_fuentes_administrativas_restriccion.t_id"
                + "      LEFT JOIN info_interesados_restriccion ON col_restriccion.t_id = info_interesados_restriccion.t_id"
                + "      LEFT JOIN info_agrupacion_interesados_restriccion ON col_restriccion.t_id = info_agrupacion_interesados_restriccion.t_id"
                + "      WHERE col_restriccion.t_id IN (SELECT * FROM restricciones_seleccionadas)"
                + "      GROUP BY col_restriccion.unidad_predio" + "    ),"
                + "     info_contacto_interesados_responsabilidad AS ("
                + "            SELECT interesado_contacto.interesado," + "              json_agg("
                + "                    json_build_object('id', interesado_contacto.t_id,"
                + "                                           'attributes', json_build_object('Teléfono 1', interesado_contacto.telefono1,"
                + "                                                                           'Teléfono 2', interesado_contacto.telefono2,"
                + "                                                                           'Domicilio notificación', interesado_contacto.domicilio_notificacion,"
                + "                                                                           'Correo_Electrónico', interesado_contacto.correo_electronico,"
                + "                                                                           'Origen_de_datos', interesado_contacto.origen_datos)) ORDER BY interesado_contacto.t_id)"
                + "            FILTER(WHERE interesado_contacto.t_id IS NOT NULL) AS interesado_contacto"
                + "            FROM {schema}.interesado_contacto"
                + "            WHERE interesado_contacto.interesado IN (SELECT responsabilidades_interesados.interesado_col_interesado FROM responsabilidades_interesados)"
                + "            GROUP BY interesado_contacto.interesado" + "     ),"
                + "     info_interesados_responsabilidad AS ("
                + "         SELECT responsabilidades_interesados.t_id," + "          json_agg("
                + "            json_build_object('id', col_interesado.t_id,"
                + "                              'attributes', json_build_object('Tipo', col_interesado.tipo,"
                + "                                                              col_interesadodocumentotipo.dispname, col_interesado.documento_identidad,"
                + "                                                              'Nombre', col_interesado.nombre,"
                + "                                                              CASE WHEN col_interesado.tipo = 'Persona_No_Natural' THEN 'Tipo interesado jurídico' ELSE 'Género' END, CASE WHEN col_interesado.tipo = 'Persona_No_Natural' THEN col_interesado.tipo_interesado_juridico ELSE col_interesado.genero END,"
                + "                                                              'interesado_contacto', COALESCE(info_contacto_interesados_responsabilidad.interesado_contacto, '[]')))"
                + "         ORDER BY col_interesado.t_id) FILTER (WHERE col_interesado.t_id IS NOT NULL) AS col_interesado"
                + "         FROM responsabilidades_interesados LEFT JOIN {schema}.col_interesado ON col_interesado.t_id = responsabilidades_interesados.interesado_col_interesado"
                + "         LEFT JOIN {schema}.col_interesadodocumentotipo ON col_interesadodocumentotipo.ilicode = col_interesado.tipo_documento"
                + "         LEFT JOIN info_contacto_interesados_responsabilidad ON info_contacto_interesados_responsabilidad.interesado = col_interesado.t_id"
                + "         GROUP BY responsabilidades_interesados.t_id" + "     ),"
                + "     info_contacto_interesado_agrupacion_interesados_responsabilidad AS ("
                + "            SELECT interesado_contacto.interesado," + "              json_agg("
                + "                    json_build_object('id', interesado_contacto.t_id,"
                + "                                           'attributes', json_build_object('Teléfono 1', interesado_contacto.telefono1,"
                + "                                                                           'Teléfono 2', interesado_contacto.telefono2,"
                + "                                                                           'Domicilio notificación', interesado_contacto.domicilio_notificacion,"
                + "                                                                           'Correo_Electrónico', interesado_contacto.correo_electronico,"
                + "                                                                           'Origen_de_datos', interesado_contacto.origen_datos)) ORDER BY interesado_contacto.t_id)"
                + "            FILTER(WHERE interesado_contacto.t_id IS NOT NULL) AS interesado_contacto"
                + "            FROM {schema}.interesado_contacto LEFT JOIN responsabilidades_interesados ON responsabilidades_interesados.interesado_col_interesado = interesado_contacto.interesado"
                + "            WHERE interesado_contacto.interesado IN (SELECT DISTINCT responsabilidades_agrupacion_interesados.interesados_col_interesado FROM responsabilidades_agrupacion_interesados)"
                + "            GROUP BY interesado_contacto.interesado" + "     ),"
                + "     info_interesados_agrupacion_interesados_responsabilidad AS ("
                + "         SELECT responsabilidades_agrupacion_interesados.interesado_la_agrupacion_interesados,"
                + "          json_agg(" + "            json_build_object('id', col_interesado.t_id,"
                + "                              'attributes', json_build_object(col_interesadodocumentotipo.dispname, col_interesado.documento_identidad,"
                + "                                                              'Nombre', col_interesado.nombre,"
                + "                                                              CASE WHEN col_interesado.tipo = 'Persona_No_Natural' THEN 'Tipo interesado jurídico' ELSE 'Género' END, CASE WHEN col_interesado.tipo = 'Persona_No_Natural' THEN col_interesado.tipo_interesado_juridico ELSE col_interesado.genero END,"
                + "                                                              'interesado_contacto', COALESCE(info_contacto_interesado_agrupacion_interesados_responsabilidad.interesado_contacto, '[]'),"
                + "                                                              'fraccion', ROUND((fraccion.numerador::numeric/fraccion.denominador::numeric)*100,2) ))"
                + "         ORDER BY col_interesado.t_id) FILTER (WHERE col_interesado.t_id IS NOT NULL) AS col_interesado"
                + "         FROM responsabilidades_agrupacion_interesados LEFT JOIN {schema}.col_interesado ON col_interesado.t_id = responsabilidades_agrupacion_interesados.interesados_col_interesado"
                + "         LEFT JOIN {schema}.col_interesadodocumentotipo ON col_interesadodocumentotipo.ilicode = col_interesado.tipo_documento"
                + "         LEFT JOIN info_contacto_interesado_agrupacion_interesados_responsabilidad ON info_contacto_interesado_agrupacion_interesados_responsabilidad.interesado = col_interesado.t_id"
                + "         LEFT JOIN {schema}.miembros ON (miembros.agrupacion::text || miembros.interesados_col_interesado::text) = (responsabilidades_agrupacion_interesados.interesado_la_agrupacion_interesados::text|| col_interesado.t_id::text)"
                + "         LEFT JOIN {schema}.fraccion ON miembros.t_id = fraccion.miembros_participacion"
                + "         GROUP BY responsabilidades_agrupacion_interesados.interesado_la_agrupacion_interesados"
                + "     )," + "     info_agrupacion_interesados_responsabilidad AS ("
                + "         SELECT col_responsabilidad.t_id," + "         json_agg("
                + "            json_build_object('id', la_agrupacion_interesados.t_id,"
                + "                              'attributes', json_build_object('Tipo de agrupación de interesados', la_agrupacion_interesados.ai_tipo,"
                + "                                                              'Nombre', la_agrupacion_interesados.nombre,"
                + "                                                              'col_interesado', COALESCE(info_interesados_agrupacion_interesados_responsabilidad.col_interesado, '[]')))"
                + "         ORDER BY la_agrupacion_interesados.t_id) FILTER (WHERE la_agrupacion_interesados.t_id IS NOT NULL) AS la_agrupacion_interesados"
                + "         FROM {schema}.la_agrupacion_interesados LEFT JOIN {schema}.col_responsabilidad ON la_agrupacion_interesados.t_id = col_responsabilidad.interesado_la_agrupacion_interesados"
                + "         LEFT JOIN info_interesados_agrupacion_interesados_responsabilidad ON info_interesados_agrupacion_interesados_responsabilidad.interesado_la_agrupacion_interesados = la_agrupacion_interesados.t_id"
                + "         WHERE la_agrupacion_interesados.t_id IN (SELECT DISTINCT responsabilidades_agrupacion_interesados.interesado_la_agrupacion_interesados FROM responsabilidades_agrupacion_interesados)"
                + "         AND col_responsabilidad.t_id IN (SELECT responsabilidades_seleccionadas.t_id FROM responsabilidades_seleccionadas)"
                + "         GROUP BY col_responsabilidad.t_id" + "     ),"
                + "     info_fuentes_administrativas_responsabilidad AS ("
                + "        SELECT col_responsabilidad.t_id," + "         json_agg("
                + "            json_build_object('id', col_fuenteadministrativa.t_id,"
                + "                              'attributes', json_build_object('Tipo de fuente administrativa', col_fuenteadministrativa.tipo,"
                + "                                                              'Nombre', col_fuenteadministrativa.nombre,"
                + "                                                              'Estado disponibilidad', col_fuenteadministrativa.estado_disponibilidad,"
                + "                                                              'Archivo fuente', extarchivo.datos))"
                + "         ORDER BY col_fuenteadministrativa.t_id) FILTER (WHERE col_fuenteadministrativa.t_id IS NOT NULL) AS col_fuenteadministrativa"
                + "        FROM {schema}.col_responsabilidad"
                + "        LEFT JOIN {schema}.rrrfuente ON col_responsabilidad.t_id = rrrfuente.rrr_col_responsabilidad"
                + "        LEFT JOIN {schema}.col_fuenteadministrativa ON rrrfuente.rfuente = col_fuenteadministrativa.t_id"
                + "        LEFT JOIN {schema}.extarchivo ON extarchivo.col_fuenteadminstrtiva_ext_archivo_id = col_fuenteadministrativa.t_id"
                + "        WHERE col_responsabilidad.t_id IN (SELECT responsabilidades_seleccionadas.t_id FROM responsabilidades_seleccionadas)"
                + "        GROUP BY col_responsabilidad.t_id" + "     ),"
                + "    info_responsabilidad AS (" + "      SELECT col_responsabilidad.unidad_predio,"
                + "        json_agg(" + "            json_build_object('id', col_responsabilidad.t_id,"
                + "                              'attributes', json_build_object('Tipo de responsabilidad', col_responsabilidad.tipo,"
                + "                                                              'Código registral', col_responsabilidad.codigo_registral_responsabilidad,"
                + "                                                              'Descripción', col_responsabilidad.descripcion,"
                + "                                                              'col_fuenteadministrativa', COALESCE(info_fuentes_administrativas_responsabilidad.col_fuenteadministrativa, '[]'),"
                + "                                                              CASE WHEN info_agrupacion_interesados_responsabilidad.la_agrupacion_interesados IS NOT NULL THEN 'la_agrupacion_interesados' ELSE 'col_interesado' END, CASE WHEN info_agrupacion_interesados_responsabilidad.la_agrupacion_interesados IS NOT NULL THEN COALESCE(info_agrupacion_interesados_responsabilidad.la_agrupacion_interesados, '[]') ELSE COALESCE(info_interesados_responsabilidad.col_interesado, '[]') END))"
                + "         ORDER BY col_responsabilidad.t_id) FILTER (WHERE col_responsabilidad.t_id IS NOT NULL) AS col_responsabilidad"
                + "      FROM {schema}.col_responsabilidad LEFT JOIN info_fuentes_administrativas_responsabilidad ON col_responsabilidad.t_id = info_fuentes_administrativas_responsabilidad.t_id"
                + "      LEFT JOIN info_interesados_responsabilidad ON col_responsabilidad.t_id = info_interesados_responsabilidad.t_id"
                + "      LEFT JOIN info_agrupacion_interesados_responsabilidad ON col_responsabilidad.t_id = info_agrupacion_interesados_responsabilidad.t_id"
                + "      WHERE col_responsabilidad.t_id IN (SELECT * FROM responsabilidades_seleccionadas)"
                + "      GROUP BY col_responsabilidad.unidad_predio" + "    ),"
                + "     info_contacto_interesados_hipoteca AS ("
                + "            SELECT interesado_contacto.interesado," + "              json_agg("
                + "                    json_build_object('id', interesado_contacto.t_id,"
                + "                                           'attributes', json_build_object('Teléfono 1', interesado_contacto.telefono1,"
                + "                                                                           'Teléfono 2', interesado_contacto.telefono2,"
                + "                                                                           'Domicilio notificación', interesado_contacto.domicilio_notificacion,"
                + "                                                                           'Correo_Electrónico', interesado_contacto.correo_electronico,"
                + "                                                                           'Origen_de_datos', interesado_contacto.origen_datos)) ORDER BY interesado_contacto.t_id)"
                + "            FILTER(WHERE interesado_contacto.t_id IS NOT NULL) AS interesado_contacto"
                + "            FROM {schema}.interesado_contacto"
                + "            WHERE interesado_contacto.interesado IN (SELECT hipotecas_interesados.interesado_col_interesado FROM hipotecas_interesados)"
                + "            GROUP BY interesado_contacto.interesado" + "     ),"
                + "     info_interesados_hipoteca AS (" + "         SELECT hipotecas_interesados.t_id,"
                + "          json_agg(" + "            json_build_object('id', col_interesado.t_id,"
                + "                              'attributes', json_build_object('Tipo', col_interesado.tipo,"
                + "                                                              col_interesadodocumentotipo.dispname, col_interesado.documento_identidad,"
                + "                                                              'Nombre', col_interesado.nombre,"
                + "                                                              CASE WHEN col_interesado.tipo = 'Persona_No_Natural' THEN 'Tipo interesado jurídico' ELSE 'Género' END, CASE WHEN col_interesado.tipo = 'Persona_No_Natural' THEN col_interesado.tipo_interesado_juridico ELSE col_interesado.genero END,"
                + "                                                              'interesado_contacto', COALESCE(info_contacto_interesados_hipoteca.interesado_contacto, '[]')))"
                + "         ORDER BY col_interesado.t_id) FILTER (WHERE col_interesado.t_id IS NOT NULL) AS col_interesado"
                + "         FROM hipotecas_interesados LEFT JOIN {schema}.col_interesado ON col_interesado.t_id = hipotecas_interesados.interesado_col_interesado"
                + "         LEFT JOIN {schema}.col_interesadodocumentotipo ON col_interesadodocumentotipo.ilicode = col_interesado.tipo_documento"
                + "         LEFT JOIN info_contacto_interesados_hipoteca ON info_contacto_interesados_hipoteca.interesado = col_interesado.t_id"
                + "         GROUP BY hipotecas_interesados.t_id" + "     ),"
                + "     info_contacto_interesado_agrupacion_interesados_hipoteca AS ("
                + "            SELECT interesado_contacto.interesado," + "              json_agg("
                + "                    json_build_object('id', interesado_contacto.t_id,"
                + "                                           'attributes', json_build_object('Teléfono 1', interesado_contacto.telefono1,"
                + "                                                                           'Teléfono 2', interesado_contacto.telefono2,"
                + "                                                                           'Domicilio notificación', interesado_contacto.domicilio_notificacion,"
                + "                                                                           'Correo_Electrónico', interesado_contacto.correo_electronico,"
                + "                                                                           'Origen_de_datos', interesado_contacto.origen_datos)) ORDER BY interesado_contacto.t_id)"
                + "            FILTER(WHERE interesado_contacto.t_id IS NOT NULL) AS interesado_contacto"
                + "            FROM {schema}.interesado_contacto LEFT JOIN hipotecas_interesados ON hipotecas_interesados.interesado_col_interesado = interesado_contacto.interesado"
                + "            WHERE interesado_contacto.interesado IN (SELECT DISTINCT hipotecas_agrupacion_interesados.interesados_col_interesado FROM hipotecas_agrupacion_interesados)"
                + "            GROUP BY interesado_contacto.interesado" + "     ),"
                + "     info_interesados_agrupacion_interesados_hipoteca AS ("
                + "         SELECT hipotecas_agrupacion_interesados.interesado_la_agrupacion_interesados,"
                + "          json_agg(" + "            json_build_object('id', col_interesado.t_id,"
                + "                              'attributes', json_build_object(col_interesadodocumentotipo.dispname, col_interesado.documento_identidad,"
                + "                                                              'Nombre', col_interesado.nombre,"
                + "                                                              CASE WHEN col_interesado.tipo = 'Persona_No_Natural' THEN 'Tipo interesado jurídico' ELSE 'Género' END, CASE WHEN col_interesado.tipo = 'Persona_No_Natural' THEN col_interesado.tipo_interesado_juridico ELSE col_interesado.genero END,"
                + "                                                              'interesado_contacto', COALESCE(info_contacto_interesado_agrupacion_interesados_hipoteca.interesado_contacto, '[]'),"
                + "                                                              'fraccion', ROUND((fraccion.numerador::numeric/fraccion.denominador::numeric)*100,2) ))"
                + "         ORDER BY col_interesado.t_id) FILTER (WHERE col_interesado.t_id IS NOT NULL) AS col_interesado"
                + "         FROM hipotecas_agrupacion_interesados LEFT JOIN {schema}.col_interesado ON col_interesado.t_id = hipotecas_agrupacion_interesados.interesados_col_interesado"
                + "         LEFT JOIN {schema}.col_interesadodocumentotipo ON col_interesadodocumentotipo.ilicode = col_interesado.tipo_documento"
                + "         LEFT JOIN info_contacto_interesado_agrupacion_interesados_hipoteca ON info_contacto_interesado_agrupacion_interesados_hipoteca.interesado = col_interesado.t_id"
                + "         LEFT JOIN {schema}.miembros ON (miembros.agrupacion::text || miembros.interesados_col_interesado::text) = (hipotecas_agrupacion_interesados.interesado_la_agrupacion_interesados::text|| col_interesado.t_id::text)"
                + "         LEFT JOIN {schema}.fraccion ON miembros.t_id = fraccion.miembros_participacion"
                + "         GROUP BY hipotecas_agrupacion_interesados.interesado_la_agrupacion_interesados"
                + "     )," + "     info_agrupacion_interesados_hipoteca AS ("
                + "         SELECT col_hipoteca.t_id," + "         json_agg("
                + "            json_build_object('id', la_agrupacion_interesados.t_id,"
                + "                              'attributes', json_build_object('Tipo de agrupación de interesados', la_agrupacion_interesados.ai_tipo,"
                + "                                                              'Nombre', la_agrupacion_interesados.nombre,"
                + "                                                              'col_interesado', COALESCE(info_interesados_agrupacion_interesados_hipoteca.col_interesado, '[]')))"
                + "         ORDER BY la_agrupacion_interesados.t_id) FILTER (WHERE la_agrupacion_interesados.t_id IS NOT NULL) AS la_agrupacion_interesados"
                + "         FROM {schema}.la_agrupacion_interesados LEFT JOIN {schema}.col_hipoteca ON la_agrupacion_interesados.t_id = col_hipoteca.interesado_la_agrupacion_interesados"
                + "         LEFT JOIN info_interesados_agrupacion_interesados_hipoteca ON info_interesados_agrupacion_interesados_hipoteca.interesado_la_agrupacion_interesados = la_agrupacion_interesados.t_id"
                + "         WHERE la_agrupacion_interesados.t_id IN (SELECT DISTINCT hipotecas_agrupacion_interesados.interesado_la_agrupacion_interesados FROM hipotecas_agrupacion_interesados)"
                + "         AND col_hipoteca.t_id IN (SELECT hipotecas_seleccionadas.t_id FROM hipotecas_seleccionadas)"
                + "         GROUP BY col_hipoteca.t_id" + "     ),"
                + "     info_fuentes_administrativas_hipoteca AS ("
                + "        SELECT col_hipoteca.t_id," + "         json_agg("
                + "            json_build_object('id', col_fuenteadministrativa.t_id,"
                + "                              'attributes', json_build_object('Tipo de fuente administrativa', col_fuenteadministrativa.tipo,"
                + "                                                              'Nombre', col_fuenteadministrativa.nombre,"
                + "                                                              'Estado disponibilidad', col_fuenteadministrativa.estado_disponibilidad,"
                + "                                                              'Archivo fuente', extarchivo.datos))"
                + "         ORDER BY col_fuenteadministrativa.t_id) FILTER (WHERE col_fuenteadministrativa.t_id IS NOT NULL) AS col_fuenteadministrativa"
                + "        FROM {schema}.col_hipoteca"
                + "        LEFT JOIN {schema}.rrrfuente ON col_hipoteca.t_id = rrrfuente.rrr_col_hipoteca"
                + "        LEFT JOIN {schema}.col_fuenteadministrativa ON rrrfuente.rfuente = col_fuenteadministrativa.t_id"
                + "        LEFT JOIN {schema}.extarchivo ON extarchivo.col_fuenteadminstrtiva_ext_archivo_id = col_fuenteadministrativa.t_id"
                + "        WHERE col_hipoteca.t_id IN (SELECT hipotecas_seleccionadas.t_id FROM hipotecas_seleccionadas)"
                + "        GROUP BY col_hipoteca.t_id" + "     )," + "    info_hipoteca AS ("
                + "      SELECT col_hipoteca.unidad_predio," + "        json_agg("
                + "            json_build_object('id', col_hipoteca.t_id,"
                + "                              'attributes', json_build_object('Tipo de hipoteca', col_hipoteca.tipo,"
                + "                                                              'Código registral', col_hipoteca.codigo_registral_hipoteca,"
                + "                                                              'Descripción', col_hipoteca.descripcion,"
                + "                                                              'col_fuenteadministrativa', COALESCE(info_fuentes_administrativas_hipoteca.col_fuenteadministrativa, '[]'),"
                + "                                                              CASE WHEN info_agrupacion_interesados_hipoteca.la_agrupacion_interesados IS NOT NULL THEN 'la_agrupacion_interesados' ELSE 'col_interesado' END, CASE WHEN info_agrupacion_interesados_hipoteca.la_agrupacion_interesados IS NOT NULL THEN COALESCE(info_agrupacion_interesados_hipoteca.la_agrupacion_interesados, '[]') ELSE COALESCE(info_interesados_hipoteca.col_interesado, '[]') END))"
                + "         ORDER BY col_hipoteca.t_id) FILTER (WHERE col_hipoteca.t_id IS NOT NULL) AS col_hipoteca"
                + "      FROM {schema}.col_hipoteca LEFT JOIN info_fuentes_administrativas_hipoteca ON col_hipoteca.t_id = info_fuentes_administrativas_hipoteca.t_id"
                + "      LEFT JOIN info_interesados_hipoteca ON col_hipoteca.t_id = info_interesados_hipoteca.t_id"
                + "      LEFT JOIN info_agrupacion_interesados_hipoteca ON col_hipoteca.t_id = info_agrupacion_interesados_hipoteca.t_id"
                + "      WHERE col_hipoteca.t_id IN (SELECT * FROM hipotecas_seleccionadas)"
                + "      GROUP BY col_hipoteca.unidad_predio" + "    )," + "     info_predio AS ("
                + "         SELECT uebaunit.ue_terreno,"
                + "                json_agg(json_build_object('id', predio.t_id,"
                + "                                  'attributes', json_build_object('Nombre', predio.nombre,"
                + "                                                                  'NUPRE', predio.nupre,"
                + "                                                                  'FMI', predio.fmi,"
                + "                                                                  'Número predial', predio.numero_predial,"
                + "                                                                  'Número predial anterior', predio.numero_predial_anterior,"
                + "                                                                  'col_derecho', COALESCE(info_derecho.col_derecho, '[]'),"
                + "                                                                  'col_restriccion', COALESCE(info_restriccion.col_restriccion, '[]'),"
                + "                                                                  'col_responsabilidad', COALESCE(info_responsabilidad.col_responsabilidad, '[]'),"
                + "                                                                  'col_hipoteca', COALESCE(info_hipoteca.col_hipoteca, '[]')"
                + "                                                                 )) ORDER BY predio.t_id) FILTER(WHERE predio.t_id IS NOT NULL) as predio"
                + "         FROM {schema}.predio LEFT JOIN {schema}.uebaunit ON uebaunit.baunit_predio = predio.t_id"
                + "         LEFT JOIN info_derecho ON info_derecho.unidad_predio = predio.t_id"
                + "         LEFT JOIN info_restriccion ON info_restriccion.unidad_predio = predio.t_id"
                + "         LEFT JOIN info_responsabilidad ON info_responsabilidad.unidad_predio = predio.t_id"
                + "         LEFT JOIN info_hipoteca ON info_hipoteca.unidad_predio = predio.t_id"
                + "         WHERE predio.t_id IN (SELECT * FROM predios_seleccionados)"
                + "            AND uebaunit.ue_terreno IS NOT NULL"
                + "            AND uebaunit.ue_construccion IS NULL"
                + "            AND uebaunit.ue_unidadconstruccion IS NULL"
                + "         GROUP BY uebaunit.ue_terreno" + "     )," + "     info_terreno AS ("
                + "         SELECT terreno.t_id," + "         json_build_object('id', terreno.t_id,"
                + "                            'attributes', json_build_object(CONCAT('Área de terreno' , (SELECT * FROM unidad_area_calculada_terreno)), terreno.area_calculada,"
                + "                                                            'predio', COALESCE(info_predio.predio, '[]')"
                + "                                                           )) as terreno "
                + "         FROM {schema}.terreno LEFT JOIN info_predio ON terreno.t_id = info_predio.ue_terreno"
                + "         WHERE terreno.t_id IN (SELECT * FROM terrenos_seleccionados)"
                + "         ORDER BY terreno.t_id" + "     )"
                + "    SELECT json_agg(info_terreno.terreno) AS terreno FROM info_terreno";

            query = query.replace(new RegExp('{schema}', 'g'), schema);
            query = query.replace(new RegExp('{plot_t_id}', 'g'), plot_t_id !== null ? plot_t_id : 'NULL');
            query = query.replace(new RegExp('{parcel_fmi}', 'g'), parcel_fmi !== null ? parcel_fmi : 'NULL');
            query = query.replace(new RegExp('{parcel_number}', 'g'), parcel_number !== null ? parcel_number : 'NULL');
            query = query.replace(new RegExp('{previous_parcel_number}', 'g'), previous_parcel_number !== null ? previous_parcel_number : 'NULL');

            const resultSet = await client.query(query);

            dataParcel = resultSet.rows[0].terreno;

            await client.end();

        } catch (error) {
            dataParcel = null;
        }

        return dataParcel;
    }

    static async getParcelPhysicalInformation(dataConnection, plot_t_id, parcel_fmi, parcel_number, previous_parcel_number, valuation_model) {

        const client = await this.createClient(dataConnection);

        const schema = dataConnection.schema;

        let dataParcel = null;

        try {

            await client.connect();

            let query = "WITH" + "     unidad_area_calculada_terreno AS ("
                + "         SELECT ' [' || setting || ']' FROM {schema}.t_ili2db_column_prop WHERE tablename = 'terreno' AND columnname = 'area_calculada' LIMIT 1"
                + "     )," + "     unidad_area_registral_terreno AS ("
                + "         SELECT ' [' || setting || ']' FROM {schema}.t_ili2db_column_prop WHERE tablename = 'terreno' AND columnname = 'area_registral' LIMIT 1"
                + "     )," + "     unidad_area_construida_uc AS ("
                + "         SELECT ' [' || setting || ']' FROM {schema}.t_ili2db_column_prop WHERE tablename = 'unidadconstruccion' AND columnname = 'area_construida' LIMIT 1"
                + "     )," + "     unidad_area_privada_construida_uc AS ("
                + "         SELECT ' [' || setting || ']' FROM {schema}.t_ili2db_column_prop WHERE tablename = 'unidadconstruccion' AND columnname = 'area_privada_construida' LIMIT 1"
                + "     )," + "     unidad_longitud_lindero AS ("
                + "         SELECT ' [' || setting || ']' FROM {schema}.t_ili2db_column_prop WHERE tablename = 'lindero' AND columnname = 'longitud' LIMIT 1"
                + "     )," + "     terrenos_seleccionados AS ("
                + "        SELECT {plot_t_id} AS ue_terreno WHERE '{plot_t_id}' <> 'NULL'"
                + "            UNION"
                + "        SELECT uebaunit.ue_terreno FROM {schema}.predio LEFT JOIN {schema}.uebaunit ON predio.t_id = uebaunit.baunit_predio  WHERE uebaunit.ue_terreno IS NOT NULL AND CASE WHEN '{parcel_fmi}' = 'NULL' THEN  1 = 2 ELSE predio.fmi = '{parcel_fmi}' END"
                + "            UNION"
                + "        SELECT uebaunit.ue_terreno FROM {schema}.predio LEFT JOIN {schema}.uebaunit ON predio.t_id = uebaunit.baunit_predio  WHERE uebaunit.ue_terreno IS NOT NULL AND CASE WHEN '{parcel_number}' = 'NULL' THEN  1 = 2 ELSE predio.numero_predial = '{parcel_number}' END"
                + "            UNION"
                + "        SELECT uebaunit.ue_terreno FROM {schema}.predio LEFT JOIN {schema}.uebaunit ON predio.t_id = uebaunit.baunit_predio  WHERE uebaunit.ue_terreno IS NOT NULL AND CASE WHEN '{previous_parcel_number}' = 'NULL' THEN  1 = 2 ELSE predio.numero_predial_anterior = '{previous_parcel_number}' END"
                + "     )," + "     predios_seleccionados AS ("
                + "        SELECT uebaunit.baunit_predio as t_id FROM {schema}.uebaunit WHERE uebaunit.ue_terreno = {plot_t_id} AND '{plot_t_id}' <> 'NULL'"
                + "            UNION"
                + "        SELECT t_id FROM {schema}.predio WHERE CASE WHEN '{parcel_fmi}' = 'NULL' THEN  1 = 2 ELSE predio.fmi = '{parcel_fmi}' END"
                + "            UNION"
                + "        SELECT t_id FROM {schema}.predio WHERE CASE WHEN '{parcel_number}' = 'NULL' THEN  1 = 2 ELSE predio.numero_predial = '{parcel_number}' END"
                + "            UNION"
                + "        SELECT t_id FROM {schema}.predio WHERE CASE WHEN '{previous_parcel_number}' = 'NULL' THEN  1 = 2 ELSE predio.numero_predial_anterior = '{previous_parcel_number}' END"
                + "     )," + "     construcciones_seleccionadas AS ("
                + "         SELECT ue_construccion FROM {schema}.uebaunit WHERE uebaunit.baunit_predio IN (SELECT predios_seleccionados.t_id FROM predios_seleccionados WHERE predios_seleccionados.t_id IS NOT NULL) AND ue_construccion IS NOT NULL"
                + "     )," + "     unidadesconstruccion_seleccionadas AS ("
                + "         SELECT unidadconstruccion.t_id FROM {schema}.unidadconstruccion WHERE unidadconstruccion.construccion IN (SELECT ue_construccion FROM construcciones_seleccionadas)"
                + "     )," + "     punto_lindero_externos_seleccionados AS ("
                + "         SELECT DISTINCT masccl.uep_terreno, puntolindero.t_id"
                + "         FROM {schema}.puntolindero LEFT JOIN {schema}.puntoccl ON puntolindero.t_id = puntoccl.punto_puntolindero"
                + "         LEFT JOIN {schema}.lindero ON puntoccl.ccl_lindero = lindero.t_id"
                + "         LEFT JOIN {schema}.masccl ON lindero.t_id = masccl.cclp_lindero"
                + "         WHERE masccl.uep_terreno IN (SELECT * FROM terrenos_seleccionados)"
                + "         ORDER BY masccl.uep_terreno, puntolindero.t_id" + "     ),"
                + "     punto_lindero_internos_seleccionados AS ("
                + "        SELECT DISTINCT menos.eu_terreno, puntolindero.t_id"
                + "        FROM {schema}.puntolindero LEFT JOIN {schema}.puntoccl ON puntolindero.t_id = puntoccl.punto_puntolindero"
                + "        LEFT JOIN {schema}.lindero ON puntoccl.ccl_lindero = lindero.t_id"
                + "        LEFT JOIN {schema}.menos ON lindero.t_id = menos.ccl_lindero"
                + "        WHERE menos.eu_terreno IN (SELECT * FROM terrenos_seleccionados)"
                + "        ORDER BY menos.eu_terreno, puntolindero.t_id" + "     ),"
                + "     uc_fuente_espacial AS (" + "        SELECT uefuente.ue_unidadconstruccion,"
                + "            json_agg("
                + "                    json_build_object('id', col_fuenteespacial.t_id,"
                + "                                           'attributes', json_build_object('Tipo de fuente espacial', col_fuenteespacial.Tipo,"
                + "                                                                           'Estado disponibilidad', col_fuenteespacial.estado_disponibilidad,"
                + "                                                                           'Tipo principal', col_fuenteespacial.tipo_principal,"
                + "                                                                           'Fecha de entrega', col_fuenteespacial.fecha_entrega,"
                + "                                                                           'Fecha de grabación', col_fuenteespacial.fecha_grabacion,"
                + "                                                                           'Enlace fuente espacial', extarchivo.datos))"
                + "            ORDER BY col_fuenteespacial.t_id) FILTER(WHERE ueFuente.pfuente IS NOT NULL) AS col_fuenteespacial"
                + "        FROM {schema}.uefuente LEFT JOIN {schema}.col_fuenteespacial ON uefuente.pfuente = col_fuenteespacial.t_id"
                + "        LEFT JOIN {schema}.extarchivo ON extarchivo.col_fuenteespacial_ext_archivo_id = col_fuenteespacial.t_id"
                + "        WHERE uefuente.ue_unidadconstruccion IN (SELECT * FROM unidadesconstruccion_seleccionadas)"
                + "        GROUP BY ueFuente.ue_unidadconstruccion " + "     )," + "    info_uc AS ("
                + "         SELECT unidadconstruccion.construccion,"
                + "                json_agg(json_build_object('id', unidadconstruccion.t_id,"
                + "                                  'attributes', json_build_object('Número de pisos', unidadconstruccion.numero_pisos,";

            if (valuation_model) {
                query += "                                                                  'Uso', unidad_construccion.uso,"
                    + "                                                                  'Puntuación', unidad_construccion.puntuacion,"
                    + "                                                                  'Tipología', unidad_construccion.tipologia,"
                    + "                                                                  'Puntuación', unidad_construccion.puntuacion,"
                    + "                                                                  'Destino económico', unidad_construccion.destino_econo,"
                    + "                                                                  'Tipo de construcción', unidad_construccion.construccion_tipo,";
            } else {
                query += "                                                                  'Uso', NULL,"
                    + "                                                                  'Puntuación', NULL,"
                    + "                                                                  'Tipología', NULL,"
                    + "                                                                  'Puntuación', NULL,"
                    + "                                                                  'Destino económico', NULL,"
                    + "                                                                  'Tipo de construcción', NULL,";
            }

            query += "                                                                  CONCAT('Área privada construida' , (SELECT * FROM unidad_area_privada_construida_uc)), unidadconstruccion.area_privada_construida,"
                + "                                                                  CONCAT('Área construida' , (SELECT * FROM unidad_area_construida_uc)), unidadconstruccion.area_construida,"
                + "                                                                  'col_fuenteespacial', COALESCE(uc_fuente_espacial.col_fuenteespacial, '[]')"
                + "                                                                 )) ORDER BY unidadconstruccion.t_id) FILTER(WHERE unidadconstruccion.t_id IS NOT NULL) AS unidadconstruccion"
                + "         FROM {schema}.unidadconstruccion LEFT JOIN uc_fuente_espacial ON unidadconstruccion.t_id = uc_fuente_espacial.ue_unidadconstruccion";

            if (valuation_model) {
                query += " LEFT JOIN {schema}.avaluounidadconstruccion ON unidadconstruccion.t_id = avaluounidadconstruccion.ucons"
                    + "         LEFT JOIN {schema}.unidad_construccion ON avaluounidadconstruccion.aucons = unidad_construccion.t_id ";
            }
            query += "      WHERE unidadconstruccion.t_id IN (SELECT * FROM unidadesconstruccion_seleccionadas)"
                + "         GROUP BY unidadconstruccion.construccion" + "     ),"
                + "     c_fuente_espacial AS (" + "        SELECT uefuente.ue_construccion,"
                + "            json_agg("
                + "                    json_build_object('id', col_fuenteespacial.t_id,"
                + "                                           'attributes', json_build_object('Tipo de fuente espacial', col_fuenteespacial.Tipo,"
                + "                                                                           'Estado disponibilidad', col_fuenteespacial.estado_disponibilidad,"
                + "                                                                           'Tipo principal', col_fuenteespacial.tipo_principal,"
                + "                                                                           'Fecha de entrega', col_fuenteespacial.fecha_entrega,"
                + "                                                                           'Fecha de grabación', col_fuenteespacial.fecha_grabacion,"
                + "                                                                           'Enlace fuente espacial', extarchivo.datos))"
                + "            ORDER BY col_fuenteespacial.t_id) FILTER(WHERE ueFuente.pfuente IS NOT NULL) AS col_fuenteespacial"
                + "        FROM {schema}.uefuente LEFT JOIN {schema}.col_fuenteespacial ON uefuente.pfuente = col_fuenteespacial.t_id"
                + "        LEFT JOIN {schema}.extarchivo ON extarchivo.col_fuenteespacial_ext_archivo_id = col_fuenteespacial.t_id"
                + "        WHERE uefuente.ue_construccion IN (SELECT * FROM construcciones_seleccionadas)"
                + "        GROUP BY uefuente.ue_construccion " + "     ),"
                + "     info_construccion as (" + "      SELECT uebaunit.baunit_predio,"
                + "            json_agg(json_build_object('id', construccion.t_id,"
                + "                              'attributes', json_build_object('Área construcción', construccion.area_construccion,";

            if (valuation_model) {
                query += "   'Ńúmero de pisos', avaluos_v2_2_1avaluos_construccion.numero_pisos, ";

            } else {
                query += "   'Ńúmero de pisos', NULL, ";
            }
            query += "                                                              'col_fuenteespacial', COALESCE(c_fuente_espacial.col_fuenteespacial, '[]'),"
                + "                                                              'unidadconstruccion', COALESCE(info_uc.unidadconstruccion, '[]')"
                + "                                                             )) ORDER BY construccion.t_id) FILTER(WHERE construccion.t_id IS NOT NULL) as construccion"
                + "      FROM {schema}.construccion LEFT JOIN c_fuente_espacial ON construccion.t_id = c_fuente_espacial.ue_construccion"
                + "      LEFT JOIN info_uc ON construccion.t_id = info_uc.construccion"
                + "      LEFT JOIN {schema}.uebaunit ON uebaunit.ue_construccion = construccion.t_id ";

            if (valuation_model) {
                query += "        LEFT JOIN {schema}.avaluoconstruccion ON avaluoconstruccion.cons = construccion.t_id"
                    + "        LEFT JOIN {schema}.avaluos_v2_2_1avaluos_construccion  ON avaluos_v2_2_1avaluos_construccion.t_id = avaluoconstruccion.acons";
            }
            query += "      WHERE construccion.t_id IN (SELECT * FROM construcciones_seleccionadas)"
                + "      GROUP BY uebaunit.baunit_predio" + "     )," + "     info_predio AS ("
                + "         SELECT uebaunit.ue_terreno,"
                + "                json_agg(json_build_object('id', predio.t_id,"
                + "                                  'attributes', json_build_object('Nombre', predio.nombre,"
                + "                                                                  'NUPRE', predio.nupre,"
                + "                                                                  'FMI', predio.fmi,"
                + "                                                                  'Tipo', predio.tipo,"
                + "                                                                  'Número predial', predio.numero_predial,"
                + "                                                                  'Número predial anterior', predio.numero_predial_anterior,"
                + "                                                                  'construccion', COALESCE(info_construccion.construccion, '[]')"
                + "                                                                 )) ORDER BY predio.t_id) FILTER(WHERE predio.t_id IS NOT NULL) as predio"
                + "         FROM {schema}.predio LEFT JOIN {schema}.uebaunit ON uebaunit.baunit_predio = predio.t_id"
                + "         LEFT JOIN info_construccion ON info_construccion.baunit_predio = predio.t_id"
                + "         WHERE predio.t_id IN (SELECT * FROM predios_seleccionados)"
                + "         AND uebaunit.ue_terreno IS NOT NULL"
                + "		 AND uebaunit.ue_construccion IS NULL"
                + "		 AND uebaunit.ue_unidadconstruccion IS NULL"
                + "		 GROUP BY uebaunit.ue_terreno" + "     )," + "     t_fuente_espacial AS ("
                + "        SELECT uefuente.ue_terreno," + "            json_agg("
                + "                    json_build_object('id', col_fuenteespacial.t_id,"
                + "                                           'attributes', json_build_object('Tipo de fuente espacial', col_fuenteespacial.Tipo,"
                + "                                                                           'Estado disponibilidad', col_fuenteespacial.estado_disponibilidad,"
                + "                                                                           'Tipo principal', col_fuenteespacial.tipo_principal,"
                + "                                                                           'Fecha de entrega', col_fuenteespacial.fecha_entrega,"
                + "                                                                           'Fecha de grabación', col_fuenteespacial.fecha_grabacion,"
                + "                                                                           'Enlace fuente espacial', extarchivo.datos))														   "
                + "            ORDER BY col_fuenteespacial.t_id) FILTER(WHERE ueFuente.pfuente IS NOT NULL) AS col_fuenteespacial"
                + "        FROM {schema}.uefuente LEFT JOIN {schema}.col_fuenteespacial ON uefuente.pfuente = col_fuenteespacial.t_id"
                + "        LEFT JOIN {schema}.extarchivo ON extarchivo.col_fuenteespacial_ext_archivo_id = col_fuenteespacial.t_id"
                + "        WHERE uefuente.ue_terreno IN (SELECT * FROM terrenos_seleccionados)"
                + "        GROUP BY uefuente.ue_terreno " + "     ),"
                + "     info_linderos_externos AS (" + "        SELECT masccl.uep_terreno,"
                + "            json_agg(" + "                    json_build_object('id', lindero.t_id,"
                + "                                           'attributes', json_build_object(CONCAT('Longitud' , (SELECT * FROM unidad_longitud_lindero)), lindero.longitud))"
                + "            ORDER BY lindero.t_id) FILTER(WHERE lindero.t_id IS NOT NULL) AS lindero"
                + "        FROM {schema}.lindero LEFT JOIN {schema}.masccl ON lindero.t_id = masccl.cclp_lindero"
                + "        WHERE masccl.uep_terreno IN (SELECT * FROM terrenos_seleccionados)"
                + "        GROUP BY masccl.uep_terreno" + "     )," + "     info_linderos_internos AS ("
                + "        SELECT menos.eu_terreno," + "            json_agg("
                + "                    json_build_object('id', lindero.t_id,"
                + "                                           'attributes', json_build_object(CONCAT('Longitud' , (SELECT * FROM unidad_longitud_lindero)), lindero.longitud))"
                + "            ORDER BY lindero.t_id) FILTER(WHERE lindero.t_id IS NOT NULL) AS lindero"
                + "        FROM {schema}.lindero LEFT JOIN {schema}.menos ON lindero.t_id = menos.ccl_lindero"
                + "        WHERE menos.eu_terreno IN (SELECT * FROM terrenos_seleccionados)"
                + "        GROUP BY menos.eu_terreno" + "     ),"
                + "    info_punto_lindero_externos AS ("
                + "        SELECT punto_lindero_externos_seleccionados.uep_terreno,"
                + "                json_agg("
                + "                    json_build_object('id', puntolindero.t_id,"
                + "                                           'attributes', json_build_object('Nombre', puntolindero.nombre_punto,"
                + "                                                                           'coordenadas', concat(st_x(puntolindero.localizacion_original),"
                + "                                                                                         ' ', st_y(puntolindero.localizacion_original),"
                + "                                                                                         CASE WHEN st_z(puntolindero.localizacion_original) IS NOT NULL THEN concat(' ', st_z(puntolindero.localizacion_original)) END))"
                + "                ) ORDER BY puntolindero.t_id) FILTER(WHERE puntolindero.t_id IS NOT NULL) AS puntolindero"
                + "        FROM {schema}.puntolindero LEFT JOIN punto_lindero_externos_seleccionados ON puntolindero.t_id = punto_lindero_externos_seleccionados.t_id"
                + "        WHERE punto_lindero_externos_seleccionados.uep_terreno IS NOT NULL"
                + "        GROUP BY punto_lindero_externos_seleccionados.uep_terreno" + "     ),"
                + "     info_punto_lindero_internos AS ("
                + "         SELECT punto_lindero_internos_seleccionados.eu_terreno,"
                + "                json_agg("
                + "                    json_build_object('id', puntolindero.t_id,"
                + "                                           'attributes', json_build_object('Nombre', puntolindero.nombre_punto,"
                + "                                                                           'coordenadas', concat(st_x(puntolindero.localizacion_original),"
                + "                                                                                         ' ', st_y(puntolindero.localizacion_original),"
                + "                                                                                         CASE WHEN st_z(puntolindero.localizacion_original) IS NOT NULL THEN concat(' ', st_z(puntolindero.localizacion_original)) END))"
                + "                ) ORDER BY puntolindero.t_id) FILTER(WHERE puntolindero.t_id IS NOT NULL) AS puntolindero"
                + "         FROM {schema}.puntolindero LEFT JOIN punto_lindero_internos_seleccionados ON puntolindero.t_id = punto_lindero_internos_seleccionados.t_id"
                + "         WHERE punto_lindero_internos_seleccionados.eu_terreno IS NOT NULL"
                + "         GROUP BY punto_lindero_internos_seleccionados.eu_terreno" + "     ),"
                + "    col_bosqueareasemi_terreno_bosque_area_seminaturale AS ("
                + "        SELECT terreno_bosque_area_seminaturale," + "            json_agg("
                + "                    json_build_object('id', t_id,"
                + "                                           'attributes', json_build_object('avalue', avalue))"
                + "            ORDER BY t_id) FILTER(WHERE t_id IS NOT NULL) AS col_bosqueareasemi_terreno_bosque_area_seminaturale"
                + "        FROM {schema}.col_bosqueareasemi_terreno_bosque_area_seminaturale "
                + "        WHERE terreno_bosque_area_seminaturale IN (SELECT * FROM terrenos_seleccionados)"
                + "        GROUP BY terreno_bosque_area_seminaturale" + "     ),"
                + "    col_territorioagricola_terreno_territorio_agricola AS ("
                + "        SELECT terreno_territorio_agricola," + "            json_agg("
                + "                    json_build_object('id', t_id,"
                + "                                           'attributes', json_build_object('avalue', avalue))"
                + "            ORDER BY t_id) FILTER(WHERE t_id IS NOT NULL) AS col_territorioagricola_terreno_territorio_agricola"
                + "        FROM {schema}.col_territorioagricola_terreno_territorio_agricola "
                + "        WHERE terreno_territorio_agricola IN (SELECT * FROM terrenos_seleccionados)"
                + "        GROUP BY terreno_territorio_agricola" + "     ),"
                + "    col_cuerpoagua_terreno_evidencia_cuerpo_agua AS ("
                + "        SELECT terreno_evidencia_cuerpo_agua," + "            json_agg("
                + "                    json_build_object('id', t_id,"
                + "                                           'attributes', json_build_object('avalue', avalue))"
                + "            ORDER BY t_id) FILTER(WHERE t_id IS NOT NULL) AS col_cuerpoagua_terreno_evidencia_cuerpo_agua"
                + "        FROM {schema}.col_cuerpoagua_terreno_evidencia_cuerpo_agua "
                + "        WHERE terreno_evidencia_cuerpo_agua IN (SELECT * FROM terrenos_seleccionados)"
                + "        GROUP BY terreno_evidencia_cuerpo_agua" + "     ),"
                + "    col_explotaciontipo_terreno_explotacion AS ("
                + "        SELECT terreno_explotacion," + "            json_agg("
                + "                    json_build_object('id', t_id,"
                + "                                           'attributes', json_build_object('avalue', avalue))"
                + "            ORDER BY t_id) FILTER(WHERE t_id IS NOT NULL) AS col_explotaciontipo_terreno_explotacion"
                + "        FROM {schema}.col_explotaciontipo_terreno_explotacion "
                + "        WHERE terreno_explotacion IN (SELECT * FROM terrenos_seleccionados)"
                + "        GROUP BY terreno_explotacion" + "     ),"
                + "    col_afectacion_terreno_afectacion AS (" + "        SELECT terreno_afectacion,"
                + "            json_agg(" + "                    json_build_object('id', t_id,"
                + "                                           'attributes', json_build_object('avalue', avalue))"
                + "            ORDER BY t_id) FILTER(WHERE t_id IS NOT NULL) AS col_afectacion_terreno_afectacion"
                + "        FROM {schema}.col_afectacion_terreno_afectacion "
                + "        WHERE terreno_afectacion IN (SELECT * FROM terrenos_seleccionados)"
                + "        GROUP BY terreno_afectacion" + "     ),"
                + "    col_servidumbretipo_terreno_servidumbre AS ("
                + "        SELECT terreno_servidumbre," + "            json_agg("
                + "                    json_build_object('id', t_id,"
                + "                                           'attributes', json_build_object('avalue', avalue))"
                + "            ORDER BY t_id) FILTER(WHERE t_id IS NOT NULL) AS col_servidumbretipo_terreno_servidumbre"
                + "        FROM {schema}.col_servidumbretipo_terreno_servidumbre "
                + "        WHERE terreno_servidumbre IN (SELECT * FROM terrenos_seleccionados)"
                + "        GROUP BY terreno_servidumbre" + "     ),"
                + "    info_puntolevantamiento AS (" + "        SELECT uebaunit_predio.ue_terreno,"
                + "                json_agg("
                + "                        json_build_object('id', puntoslevantamiento_seleccionados.t_id_puntolevantamiento,"
                + "                                               'attributes', json_build_object('coordenadas', concat(st_x(puntoslevantamiento_seleccionados.localizacion_original), "
                + "                                                                                         ' ', st_y(puntoslevantamiento_seleccionados.localizacion_original), "
                + "                                                                                         CASE WHEN st_z(puntoslevantamiento_seleccionados.localizacion_original) IS NOT NULL THEN concat(' ', st_z(puntoslevantamiento_seleccionados.localizacion_original)) END)))"
                + "                ORDER BY puntoslevantamiento_seleccionados.t_id_puntolevantamiento) FILTER(WHERE puntoslevantamiento_seleccionados.t_id_puntolevantamiento IS NOT NULL) AS puntolevantamiento"
                + "        FROM" + "        ("
                + "            SELECT puntolevantamiento.t_id AS t_id_puntolevantamiento, puntolevantamiento.localizacion_original, construccion.t_id AS t_id_construccion  FROM {schema}.construccion, {schema}.puntolevantamiento"
                + "            WHERE ST_Intersects(construccion.poligono_creado, puntolevantamiento.localizacion_original) = True AND construccion.t_id IN (SELECT * from construcciones_seleccionadas)"
                + "        ) AS puntoslevantamiento_seleccionados"
                + "        LEFT JOIN {schema}.uebaunit AS uebaunit_construccion  ON uebaunit_construccion.ue_construccion = puntoslevantamiento_seleccionados.t_id_construccion"
                + "        LEFT JOIN {schema}.uebaunit AS uebaunit_predio ON uebaunit_predio.baunit_predio = uebaunit_construccion.baunit_predio"
                + "        WHERE uebaunit_predio.ue_terreno IS NOT NULL AND "
                + "              uebaunit_predio.ue_construccion IS NULL AND "
                + "              uebaunit_predio.ue_unidadconstruccion IS NULL"
                + "        GROUP BY uebaunit_predio.ue_terreno" + "    )," + "     info_terreno AS ("
                + "        SELECT terreno.t_id," + "          json_build_object('id', terreno.t_id,"
                + "                            'attributes', json_build_object(CONCAT('Área registral' , (SELECT * FROM unidad_area_registral_terreno)), terreno.area_registral, "
                + "                                                            CONCAT('Área calculada' , (SELECT * FROM unidad_area_calculada_terreno)), terreno.area_calculada,"
                + "                                                            'predio', COALESCE(info_predio.predio, '[]'),"
                + "                                                            'col_territorioagricola_terreno_territorio_agricola', COALESCE(col_territorioagricola_terreno_territorio_agricola.col_territorioagricola_terreno_territorio_agricola, '[]'),"
                + "                                                            'col_bosqueareasemi_terreno_bosque_area_seminaturale', COALESCE(col_bosqueareasemi_terreno_bosque_area_seminaturale.col_bosqueareasemi_terreno_bosque_area_seminaturale, '[]'),"
                + "                                                            'col_cuerpoagua_terreno_evidencia_cuerpo_agua', COALESCE(col_cuerpoagua_terreno_evidencia_cuerpo_agua.col_cuerpoagua_terreno_evidencia_cuerpo_agua, '[]'),"
                + "                                                            'col_explotaciontipo_terreno_explotacion', COALESCE(col_explotaciontipo_terreno_explotacion.col_explotaciontipo_terreno_explotacion, '[]'),"
                + "                                                            'col_afectacion_terreno_afectacion', COALESCE(col_afectacion_terreno_afectacion.col_afectacion_terreno_afectacion, '[]'),"
                + "                                                            'col_servidumbretipo_terreno_servidumbre', COALESCE(col_servidumbretipo_terreno_servidumbre.col_servidumbretipo_terreno_servidumbre, '[]'),"
                + "                                                            'Linderos externos', json_build_object('lindero', COALESCE(info_linderos_externos.lindero, '[]'),"
                + "                                                                                                   'puntolindero', COALESCE(info_punto_lindero_externos.puntolindero, '[]')),"
                + "                                                            'Linderos internos', json_build_object('lindero', COALESCE(info_linderos_internos.lindero, '[]'),"
                + "                                                                                                   'puntolindero', COALESCE(info_punto_lindero_internos.puntolindero, '[]')),"
                + "                                                            'puntolevantamiento', COALESCE(info_puntolevantamiento.puntolevantamiento, '[]'),"
                + "                                                            'col_fuenteespacial', COALESCE(t_fuente_espacial.col_fuenteespacial, '[]')"
                + "                                                           )) as terreno"
                + "        FROM {schema}.terreno LEFT JOIN info_predio ON info_predio.ue_terreno = terreno.t_id"
                + "        LEFT JOIN t_fuente_espacial ON terreno.t_id = t_fuente_espacial.ue_terreno"
                + "        LEFT JOIN info_linderos_externos ON terreno.t_id = info_linderos_externos.uep_terreno"
                + "        LEFT JOIN info_linderos_internos ON terreno.t_id = info_linderos_internos.eu_terreno"
                + "        LEFT JOIN info_punto_lindero_externos ON terreno.t_id = info_punto_lindero_externos.uep_terreno"
                + "        LEFT JOIN info_punto_lindero_internos ON terreno.t_id = info_punto_lindero_internos.eu_terreno"
                + "        LEFT JOIN col_territorioagricola_terreno_territorio_agricola ON terreno.t_id = col_territorioagricola_terreno_territorio_agricola.terreno_territorio_agricola"
                + "        LEFT JOIN col_bosqueareasemi_terreno_bosque_area_seminaturale ON terreno.t_id = col_bosqueareasemi_terreno_bosque_area_seminaturale.terreno_bosque_area_seminaturale"
                + "        LEFT JOIN col_cuerpoagua_terreno_evidencia_cuerpo_agua ON terreno.t_id = col_cuerpoagua_terreno_evidencia_cuerpo_agua.terreno_evidencia_cuerpo_agua"
                + "        LEFT JOIN col_explotaciontipo_terreno_explotacion ON terreno.t_id = col_explotaciontipo_terreno_explotacion.terreno_explotacion"
                + "        LEFT JOIN col_afectacion_terreno_afectacion ON terreno.t_id = col_afectacion_terreno_afectacion.terreno_afectacion"
                + "        LEFT JOIN col_servidumbretipo_terreno_servidumbre ON terreno.t_id = col_servidumbretipo_terreno_servidumbre.terreno_servidumbre"
                + "        LEFT JOIN info_puntolevantamiento ON terreno.t_id = info_puntolevantamiento.ue_terreno"
                + "        WHERE terreno.t_id IN (SELECT * FROM terrenos_seleccionados)"
                + "        ORDER BY terreno.t_id" + "     )				"
                + "    SELECT json_agg(info_terreno.terreno) AS terreno FROM info_terreno";

            query = query.replace(new RegExp('{schema}', 'g'), schema);
            query = query.replace(new RegExp('{plot_t_id}', 'g'), plot_t_id !== null ? plot_t_id : 'NULL');
            query = query.replace(new RegExp('{parcel_fmi}', 'g'), parcel_fmi !== null ? parcel_fmi : 'NULL');
            query = query.replace(new RegExp('{parcel_number}', 'g'), parcel_number !== null ? parcel_number : 'NULL');
            query = query.replace(new RegExp('{previous_parcel_number}', 'g'), previous_parcel_number !== null ? previous_parcel_number : 'NULL');

            const resultSet = await client.query(query);

            dataParcel = resultSet.rows[0].terreno;

            await client.end();

        } catch (error) {
            dataParcel = null;
        }

        return dataParcel;
    }

    static async getParcelIgacInformation(dataConnection, plot_t_id, parcel_fmi, parcel_number, previous_parcel_number, property_record_card_model) {

        const client = await this.createClient(dataConnection);

        const schema = dataConnection.schema;

        let dataParcel = null;

        try {

            await client.connect();

            let query = "    WITH" + "     unidad_area_calculada_terreno AS ("
                + "         SELECT ' [' || setting || ']' FROM {schema}.t_ili2db_column_prop WHERE tablename = 'terreno' AND columnname = 'area_calculada' LIMIT 1"
                + "     )," + "     terrenos_seleccionados AS ("
                + "        SELECT {plot_t_id} AS ue_terreno WHERE '{plot_t_id}' <> 'NULL'"
                + "            UNION"
                + "        SELECT uebaunit.ue_terreno FROM {schema}.predio LEFT JOIN {schema}.uebaunit ON predio.t_id = uebaunit.baunit_predio  WHERE uebaunit.ue_terreno IS NOT NULL AND CASE WHEN '{parcel_fmi}' = 'NULL' THEN  1 = 2 ELSE predio.fmi = '{parcel_fmi}' END"
                + "            UNION"
                + "        SELECT uebaunit.ue_terreno FROM {schema}.predio LEFT JOIN {schema}.uebaunit ON predio.t_id = uebaunit.baunit_predio  WHERE uebaunit.ue_terreno IS NOT NULL AND CASE WHEN '{parcel_number}' = 'NULL' THEN  1 = 2 ELSE predio.numero_predial = '{parcel_number}' END"
                + "            UNION"
                + "        SELECT uebaunit.ue_terreno FROM {schema}.predio LEFT JOIN {schema}.uebaunit ON predio.t_id = uebaunit.baunit_predio  WHERE uebaunit.ue_terreno IS NOT NULL AND CASE WHEN '{previous_parcel_number}' = 'NULL' THEN  1 = 2 ELSE predio.numero_predial_anterior = '{previous_parcel_number}' END"
                + "     )," + "     predios_seleccionados AS ("
                + "        SELECT uebaunit.baunit_predio as t_id FROM {schema}.uebaunit WHERE uebaunit.ue_terreno = {plot_t_id} AND '{plot_t_id}' <> 'NULL'"
                + "            UNION"
                + "        SELECT t_id FROM {schema}.predio WHERE CASE WHEN '{parcel_fmi}' = 'NULL' THEN  1 = 2 ELSE predio.fmi = '{parcel_fmi}' END"
                + "            UNION"
                + "        SELECT t_id FROM {schema}.predio WHERE CASE WHEN '{parcel_number}' = 'NULL' THEN  1 = 2 ELSE predio.numero_predial = '{parcel_number}' END"
                + "            UNION"
                + "        SELECT t_id FROM {schema}.predio WHERE CASE WHEN '{previous_parcel_number}' = 'NULL' THEN  1 = 2 ELSE predio.numero_predial_anterior = '{previous_parcel_number}' END"
                + "     ),";

            if (property_record_card_model) {
                query += "     predio_ficha_seleccionados AS ("
                    + "         SELECT predio_ficha.t_id FROM {schema}.predio_ficha WHERE predio_ficha.crpredio IN (SELECT * FROM predios_seleccionados)"
                    + "     )," + "     fpredio_investigacion_mercado AS ("
                    + "        SELECT investigacionmercado.fichapredio," + "            json_agg("
                    + "                    json_build_object('id', investigacionmercado.t_id,"
                    + "                                           'attributes', json_build_object('Disponible en el mercado', investigacionmercado.disponible_mercado,"
                    + "                                                                           'Tipo de oferta', investigacionmercado.tipo_oferta,"
                    + "                                                                           'Valor', investigacionmercado.valor,"
                    + "                                                                           'Nombre oferente', investigacionmercado.nombre_oferente,"
                    + "                                                                           'Teléfono contacto oferente', investigacionmercado.telefono_contacto_oferente,"
                    + "                                                                           'Observaciones', investigacionmercado.observaciones))"
                    + "            ORDER BY investigacionmercado.t_id) FILTER(WHERE investigacionmercado.t_id IS NOT NULL) AS investigacionmercado"
                    + "        FROM {schema}.investigacionmercado WHERE investigacionmercado.fichapredio IN (SELECT * FROM predio_ficha_seleccionados)"
                    + "        GROUP BY investigacionmercado.fichapredio" + "     ),"
                    + "     fpredio_nucleo_familiar AS ("
                    + "        SELECT nucleofamiliar.fichapredio," + "            json_agg("
                    + "                    json_build_object('id', nucleofamiliar.t_id,"
                    + "                                           'attributes', json_build_object('Documento de identidad', nucleofamiliar.documento_identidad,"
                    + "                                                                           'Tipo de documento', nucleofamiliar.tipo_documento,"
                    + "                                                                           'Organo emisor', nucleofamiliar.organo_emisor,"
                    + "                                                                           'Fecha de emisión', nucleofamiliar.fecha_emision,"
                    + "                                                                           'Primer nombre', nucleofamiliar.primer_nombre,"
                    + "                                                                           'Segundo nombre', nucleofamiliar.segundo_nombre,"
                    + "                                                                           'Primer apellido', nucleofamiliar.primer_apellido,"
                    + "                                                                           'Segundo apellido', nucleofamiliar.segundo_apellido,"
                    + "                                                                           'Fecha de nacimiento', nucleofamiliar.fecha_nacimiento,"
                    + "                                                                           'Lugar de nacimiento', nucleofamiliar.lugar_nacimiento,"
                    + "                                                                           'Nacionalidad', nucleofamiliar.nacionalidad,"
                    + "                                                                           'Discapacidad', nucleofamiliar.discapacidad,"
                    + "                                                                           'Género', nucleofamiliar.genero,"
                    + "                                                                           'Habita predio', nucleofamiliar.habita_predio,"
                    + "                                                                           'Parentesco', nucleofamiliar.parentesco,"
                    + "                                                                           'Etnia', nucleofamiliar.etnia,"
                    + "                                                                           'Dirección', nucleofamiliar.direccion,"
                    + "                                                                           'Celular', nucleofamiliar.celular))"
                    + "            ORDER BY nucleofamiliar.t_id) FILTER(WHERE nucleofamiliar.t_id IS NOT NULL) AS nucleofamiliar"
                    + "        FROM {schema}.nucleofamiliar WHERE nucleofamiliar.fichapredio IN (SELECT * FROM predio_ficha_seleccionados)"
                    + "        GROUP BY nucleofamiliar.fichapredio" + "     ),";
            }
            query += "     info_predio AS (" + "         SELECT uebaunit.ue_terreno,"
                + "                json_agg(json_build_object('id', predio.t_id,"
                + "                                  'attributes', json_build_object('Nombre', predio.nombre"
                + "                                                                  , 'Departamento', predio.departamento"
                + "                                                                  , 'Municipio', predio.municipio"
                + "                                                                  , 'Zona', predio.zona"
                + "                                                                  , 'NUPRE', predio.nupre"
                + "                                                                  , 'FMI', predio.fmi"
                + "                                                                  , 'Número predial', predio.numero_predial"
                + "                                                                  , 'Número predial anterior', predio.numero_predial_anterior"
                + "                                                                  , 'Tipo', predio.tipo";

            if (property_record_card_model) {
                query += /*" 	  , 'Sector', predio_ficha.sector"*/ ""
                    + "                                                                  , 'Localidad/Comuna', predio_ficha.localidad_comuna"
                    + "                                                                  , 'Barrio', predio_ficha.barrio"
                    + "                                                                  , 'Manzana/Vereda', predio_ficha.manzana_vereda"
                    + "                                                                  , 'Terreno', predio_ficha.terreno"
                    + "                                                                  , 'Condición propiedad', predio_ficha.condicion_propiedad"
                    + "                                                                  , 'Edificio', predio_ficha.edificio"
                    + "                                                                  , 'Piso', predio_ficha.piso"
                    + "                                                                  , 'Unidad', predio_ficha.unidad"
                    + "                                                                  , 'Estado NUPRE', predio_ficha.estado_nupre"
                    + "                                                                  , 'Destinación económica', predio_ficha.destinacion_economica"
                    + "                                                                  , 'Tipo de predio', predio_ficha.predio_tipo"
                    + "                                                                  , 'Tipo predio público', predio_ficha.tipo_predio_publico"
                    + "                                                                  , 'Formalidad', predio_ficha.formalidad"
                    + "                                                                  , 'Estrato', predio_ficha.estrato"
                    + "                                                                  , 'Clase suelo POT', predio_ficha.clase_suelo_pot"
                    + "                                                                  , 'Categoría suelo POT', predio_ficha.categoria_suelo_pot"
                    + "                                                                  , 'Derecho FMI', predio_ficha.derecho_fmi"
                    + "                                                                  , 'Inscrito RUPTA', predio_ficha.inscrito_rupta"
                    + "                                                                  , 'Fecha medida RUPTA', predio_ficha.fecha_medida_rupta"
                    + "                                                                  , 'Anotación FMI RUPTA', predio_ficha.anotacion_fmi_rupta"
                    + "                                                                  , 'Inscrito protección colectiva', predio_ficha.inscrito_proteccion_colectiva"
                    + "                                                                  , 'Fecha protección colectiva', predio_ficha.fecha_proteccion_colectiva"
                    + "                                                                  , 'Anotación FMI protección colectiva', predio_ficha.anotacion_fmi_proteccion_colectiva"
                    + "                                                                  , 'Inscrito proteccion Ley 1448', predio_ficha.inscrito_proteccion_ley1448"
                    + "                                                                  , 'Fecha protección ley 1448', predio_ficha.fecha_proteccion_ley1448"
                    + "                                                                  , 'Anotación FDM Ley 1448', predio_ficha.anotacion_fmi_ley1448"
                    + "                                                                  , 'Inscripción URT', predio_ficha.inscripcion_urt"
                    + "                                                                  , 'Fecha de inscripción URT', predio_ficha.fecha_inscripcion_urt"
                    + "                                                                  , 'Anotación FMI URT', predio_ficha.anotacion_fmi_urt"
                    + "                                                                  , 'Vigencia fiscal', predio_ficha.vigencia_fiscal"
                    + "                                                                  , 'Observaciones', predio_ficha.observaciones"
                    + "                                                                  , 'Fecha visita predial', predio_ficha.fecha_visita_predial"
                    + "                                                                  , 'Nombre quien atendio', predio_ficha.nombre_quien_atendio"
                    + "                                                                  , 'Número de documento de quien atendio', predio_ficha.numero_documento_quien_atendio"
                    + "                                                                  , 'Categoría quien atendio', predio_ficha.categoria_quien_atendio"
                    + "                                                                  , 'Tipo de documento de quien atendio', predio_ficha.tipo_documento_quien_atendio"
                    + "                                                                  , 'Nombre encuestador', predio_ficha.nombre_encuestador"
                    + "                                                                  , 'Número de documento encuestador', predio_ficha.numero_documento_encuestador"
                    + "                                                                  , 'Tipo de documento encuestador', predio_ficha.tipo_documento_encuestador"
                    + "                                                                  , 'nucleofamiliar', COALESCE(fpredio_nucleo_familiar.nucleofamiliar, '[]')"
                    + "                                                                  , 'investigacionmercado', COALESCE(fpredio_investigacion_mercado.investigacionmercado, '[]')";
            }
            query += " )) ORDER BY predio.t_id) FILTER(WHERE predio.t_id IS NOT NULL) as predio"
                + "         FROM {schema}.predio LEFT JOIN {schema}.uebaunit ON uebaunit.baunit_predio = predio.t_id ";

            if (property_record_card_model) {
                query += "         LEFT JOIN {schema}.predio_ficha ON predio_ficha.crpredio = predio.t_id"
                    + "         LEFT JOIN fpredio_nucleo_familiar ON fpredio_nucleo_familiar.fichapredio = predio_ficha.t_id"
                    + "         LEFT JOIN fpredio_investigacion_mercado ON fpredio_investigacion_mercado.fichapredio = predio_ficha.t_id";
            }
            query += "         WHERE predio.t_id IN (SELECT * FROM predios_seleccionados)"
                + "         AND uebaunit.ue_terreno IS NOT NULL"
                + "		 AND uebaunit.ue_construccion IS NULL"
                + "		 AND uebaunit.ue_unidadconstruccion IS NULL"
                + "		 GROUP BY uebaunit.ue_terreno" + "     )," + "     info_terreno AS ("
                + "        SELECT terreno.t_id," + "          json_build_object('id', terreno.t_id,"
                + "                            'attributes', json_build_object(CONCAT('Área de terreno' , (SELECT * FROM unidad_area_calculada_terreno)), terreno.area_calculada,"
                + "                                                            'predio', COALESCE(info_predio.predio, '[]')"
                + "                                                           )) as terreno"
                + "        FROM {schema}.terreno LEFT JOIN info_predio ON info_predio.ue_terreno = terreno.t_id"
                + "        WHERE terreno.t_id IN (SELECT * FROM terrenos_seleccionados)"
                + "        ORDER BY terreno.t_id" + "     )"
                + "    SELECT json_agg(info_terreno.terreno) AS terreno FROM info_terreno";

            query = query.replace(new RegExp('{schema}', 'g'), schema);
            query = query.replace(new RegExp('{plot_t_id}', 'g'), plot_t_id !== null ? plot_t_id : 'NULL');
            query = query.replace(new RegExp('{parcel_fmi}', 'g'), parcel_fmi !== null ? parcel_fmi : 'NULL');
            query = query.replace(new RegExp('{parcel_number}', 'g'), parcel_number !== null ? parcel_number : 'NULL');
            query = query.replace(new RegExp('{previous_parcel_number}', 'g'), previous_parcel_number !== null ? previous_parcel_number : 'NULL');

            const resultSet = await client.query(query);

            dataParcel = resultSet.rows[0].terreno;

            await client.end();
        } catch (error) {
            dataParcel = null;
        }

        return dataParcel;
    }

    static async getParcelPartyInformation(dataConnection, parcel_fmi, parcel_number, nupre) {

        const client = await this.createClient(dataConnection);

        const schema = dataConnection.schema;

        let dataParcel = [];

        try {

            await client.connect();

            let query = "SELECT array_to_json(array_agg(row_to_json(t))) from" +
                "(select " +
                "    i.t_id, " +
                "    i.nombre, " +
                "    i.razon_social, " +
                "    i.tipo, " +
                "    i.tipo_interesado_juridico, " +
                "    i.tipo_documento, " +
                "    i.documento_identidad, " +
                "    d.comienzo_vida_util_version, " +
                "    d.tipo, " +
                "    100 as participacion " +
                "from " +
                "({schema}.predio p join {schema}.col_derecho d on p.t_id=d.unidad_predio)  " +
                "join {schema}.col_interesado i on d.interesado_col_interesado=i.t_id " +
                "where p.fmi='{parcel_fmi}' OR p.nupre='{nupre}' or p.numero_predial='{parcel_number}' " +
                "union " +
                "select " +
                "    i.t_id, " +
                "    i.nombre, " +
                "    i.razon_social, " +
                "    i.tipo, " +
                "    i.tipo_interesado_juridico, " +
                "    i.tipo_documento, " +
                "    i.documento_identidad, " +
                "    d.comienzo_vida_util_version, " +
                "    d.tipo, " +
                "    f.numerador*100/f.denominador as participacion " +
                "from  " +
                "({schema}.predio p join {schema}.col_derecho d on p.t_id=d.unidad_predio)  " +
                "join {schema}.la_agrupacion_interesados ai on d.interesado_la_agrupacion_interesados = ai.t_id  " +
                "join {schema}.miembros m on ai.t_id = m.agrupacion " +
                "join {schema}.col_interesado i on i.t_id=m.interesados_col_interesado " +
                "join {schema}.fraccion f on m.t_id=f.miembros_participacion " +
                "where p.fmi='{parcel_fmi}' OR p.nupre='{nupre}' or p.numero_predial='{parcel_number}') t";

            query = query.replace(new RegExp('{schema}', 'g'), schema);
            query = query.replace(new RegExp('{parcel_fmi}', 'g'), parcel_fmi !== null ? parcel_fmi : 'NULL');
            query = query.replace(new RegExp('{parcel_number}', 'g'), parcel_number !== null ? parcel_number : 'NULL');
            query = query.replace(new RegExp('{nupre}', 'g'), nupre !== null ? nupre : 'NULL');

            const resultSet = await client.query(query);

            dataParcel = (resultSet.rows[0].array_to_json) ? resultSet.rows[0].array_to_json : [];

            await client.end();
        } catch (error) {
            dataParcel = [];
        }

        return dataParcel;
    }

    static async getParcelCatastralCodeInformation(dataConnection, terrainId) {

        const client = await this.createClient(dataConnection);

        const schema = dataConnection.schema;

        let dataParcel = null;

        try {

            await client.connect();

            let query = "select json_build_object('numero_predial',p.numero_predial) from " + schema
                + ".terreno t JOIN " + schema + ".uebaunit u ON t.t_id=u.ue_terreno JOIN " + schema
                + ".predio p ON u.baunit_predio = p.t_id where t.t_id = " + terrainId;

            const resultSet = await client.query(query);

            dataParcel = resultSet.rows[0].json_build_object;

            await client.end();
        } catch (error) {
            dataParcel = null;
        }

        return dataParcel;
    }

}