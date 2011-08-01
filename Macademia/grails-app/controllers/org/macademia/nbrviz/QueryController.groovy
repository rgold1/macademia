package org.macademia.nbrviz

import org.macademia.Graph
import grails.converters.JSON

class QueryController {

  def json2Service
  def similarity2Service

  def json = { Set<Long> queryIds ->
      Graph graph = similarity2Service.calculateQueryNeighbors(queryIds)
      def data = json2Service.buildQueryCentricGraph(queryIds, graph)
      return data as JSON
  }

  def show = {
     Set<Long> queryIds = params.queryIds.split("_").collect({ it.toLong() }) as HashSet<Long>
     render(view : 'show', model : [
        queryIds : queryIds,
        jsonData: json(queryIds)
     ])
  }
}
