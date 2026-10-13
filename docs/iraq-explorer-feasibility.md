# Iraq Map Explorer: feasibility notes

Prototype route: `/#/explorer` (see `src/pages/public/Explorer.tsx` and `src/features/explorer/`).

## Question

Can a website pull OpenStreetMap data for all of Iraq from the Overpass API, draw it on an
interactive map, and let the user pick what to show from category drop-downs?

## Answer

Yes, with one structural caveat: "everything in Iraq" cannot be fetched in one live Overpass
request. The public Overpass servers cap each query by time and memory, so the prototype
issues one query per category, scoped either to the Iraq boundary or to the visible map area.
Dense categories (roads, buildings, land use) are restricted to the visible area and a minimum
zoom. A true "all features, all of Iraq" view belongs in a pre-built vector-tile layer instead
of live queries; see "Production path" below.

## What the prototype does

- Sixty categories in eleven groups (health, education, public services, transport, roads and
  rail, finance and commerce, culture and religion, settlements, energy and water, land and
  buildings, boundaries), each defined by an Overpass tag filter in `categories.ts`.
- Generates Overpass QL on the fly and shows it in the Query tab, with a one-click link to run
  the same query in overpass-turbo.
- Tries three public Overpass mirrors in turn, honours a two-slot concurrency limit, retries on
  HTTP 429 and 5xx, and caches responses for thirty minutes in memory and session storage.
- Renders with MapLibre GL: glowing points, density heat-map, line glow for roads and rivers,
  fills for polygons, four free basemaps, globe or flat projection.
- Hover cards, a full tag drawer per feature, a filterable results list, and jump-to for all
  nineteen governorates.

## Public Overpass limits (verify against the live status page)

| Limit | Value | Source |
|---|---|---|
| Requests per day per user | about 10,000 | Overpass user manual |
| Download per day | about 1 GB (manual) or 5 GB (wiki) | manual, OSM wiki |
| Default query timeout | 180 s | OSM wiki |
| Default memory per query | 512 MiB | OSM wiki |
| Parallel requests per IP | 1 to 2 slots | maintainer posts |
| Over the limit | HTTP 429 | manual |

Sources: https://dev.overpass-api.de/overpass-doc/en/preface/commons.html and
https://wiki.openstreetmap.org/wiki/Overpass_API

## Risks

- Rate limiting: every visitor shares the public quota per IP. A production deployment needs a
  caching proxy or a self-hosted Overpass instance.
- Coverage: OSM data in Iraq is denser in the large cities than in rural areas. Validate the
  categories that matter before promising completeness.
- Licensing: OSM data is ODbL. The map shows the required attribution.
- Boundaries: multipolygon relations are stitched into rings client-side. Inner rings (holes)
  are drawn as outlines only.

## Production path

1. Download the Geofabrik Iraq extract (`iraq-latest.osm.pbf`).
2. Convert with tilemaker or tippecanoe into PMTiles and host the file statically.
3. Point MapLibre at the tiles; the category drop-downs become layer filters.
4. Refresh on a schedule; Geofabrik updates daily.

This removes rate limits and timeouts entirely, and makes the "everything" view possible.
