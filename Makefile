SERVER := localhost:3000


.PHONY: get-one-match
get-one-match: 
	curl "${SERVER}/get-one-match?gameId=3827552557" | jq

.PHONY: get-last-10-matches
get-last-10-matches: 
	curl "${SERVER}/get-last-10-matches?name=Hide+on+bush" | jq

.PHONY: get-one-match-card
get-one-match-card:
	curl "${SERVER}/get-one-match-card?gameId=3827552557&summonerId=3dKU4SONiX0Vh69_gBab3pRZIh9_vwNuojjYyy9L1R26lg" | jq