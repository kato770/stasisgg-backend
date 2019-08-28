SERVER := localhost:3000


.PHONY: get-one-match
get-one-match: 
	curl "${SERVER}/get-one-match?gameId=3827552557" | jq

.PHONY: get-last-10-matches
get-last-10-matches: 
	curl "${SERVER}/get-last-10-matches?name=Hide+on+bush" | jq