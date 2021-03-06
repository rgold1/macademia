package org.macademia.nbrviz

import org.codehaus.groovy.grails.commons.ConfigurationHolder

import edu.macalester.wpsemsim.sim.utils.KnownPhraseSimilarity

import org.macademia.SimilarInterestList
import edu.macalester.wpsemsim.utils.DocScore
import edu.macalester.wpsemsim.utils.DocScoreList
import org.macademia.SimilarInterest
import gnu.trove.set.hash.TIntHashSet

class SemanticSimilarityService {
    public static final double MIN_MOST_SIMILAR_SIM = 0.5
    def interestService

    KnownPhraseSimilarity metric = new KnownPhraseSimilarity(
            new File((String)ConfigurationHolder.config.macademia.similarityDir)
    )

    SimilarInterestList mostSimilar(int interestId, int maxResults=1000, int [] validIds = null) {
        TIntHashSet validIdSet = (validIds == null) ? null : new TIntHashSet(validIds)
        DocScoreList top = metric.mostSimilar(interestId, maxResults, validIdSet)
        List<SimilarInterest> sil = [new SimilarInterest(interestId, 1.0)]
        for (DocScore ds : top) {
            if (ds.score < MIN_MOST_SIMILAR_SIM) break
            sil.add(new SimilarInterest(ds.id, ds.score))
        }
        SimilarInterestList res = new SimilarInterestList(sil)
        res.setCount(interestService.getInterestCount(interestId as long))
        return res
    }

    double similarity(int interestId1, int interestId2) {
        if (interestId1 == interestId2) {
            return 1.0
        } else {
            return metric.similarity(interestId1, interestId2)
        }
    }

    float[][] cosimilarity(int [] interestIds) {
        float [][] M = metric.cosimilarity(interestIds, interestIds)
        for (int i : 0..interestIds.length-1) {
            M[i][i] = 1.0f
        }
        return M
    }

    float[][] cosimilarity(int [] rowInterestIds, int [] colInterestIds) {
        float [][] M = metric.cosimilarity(rowInterestIds, colInterestIds)
        for (int i : rowInterestIds.length - 1) {
            int j = colInterestIds.findIndexOf {it == rowInterestIds[i]}
            if (j >= 0) {
                M[i][j] = 1.0f
            }
        }
        return M
    }
}
