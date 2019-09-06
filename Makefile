SERVER := localhost:3000


.PHONY: get-last-10-matches
get-last-10-matches: 
	curl "${SERVER}/get-last-10-matches?summonerName=Hide+on+bush&region=kr" | jq

.PHONY: get-one-match-card
get-one-match-card:
	curl "${SERVER}/get-one-match-card?gameId=3827552557&summonerId=nDIF0AC_2TL5V0q6qBFwyvv9nv5uRL0Js0FpuTnr80c46w&region=kr" | jq

.PHONY: get-player-profile
get-player-profile:
	curl "${SERVER}/get-player-profile?summonerName=hide+on+bush&region=kr" | jq