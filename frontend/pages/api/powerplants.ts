import type { NextApiRequest, NextApiResponse } from 'next'
import 'abort-controller/polyfill.js'
import config from '@arcgis/core/config'
import { executeQueryJSON } from '@arcgis/core/rest/query'

config.request.useIdentity = false

const PLANT_URL =
  'https://services1.arcgis.com/4yjifSiIG17X0gW4/arcgis/rest/services/PowerPlants_WorldResourcesInstitute/FeatureServer/0'

type Data = {
  types: string[]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const query = {
    outFields: ['fuel1'],
    where: '1=1',
    returnDistinctValues: true,
    returnGeometry: false
  }
  const results = await executeQueryJSON(PLANT_URL, query)
  const values = results.features
    .map((feature) => feature.attributes['fuel1'])
    .filter(Boolean)
    .sort()
  res.status(200).json({ types: values })
}