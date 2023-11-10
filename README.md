
## BeerTAP
**Welcome to beerTAP: Your bar tender**

Whether the dispenser is open or close, this endpoint returns how much money has this dispenser Id spent break down by its uses. This endpoint could be request at any time, even if the tap is open (so, the `closed_at` field would be `null`).
To do so, we will use a reference value of 12.25€/l.
So, if the dispenser has configured the flow volume ratio as 0.064 litres/second and the tap was open for 22 seconds, the total spent for this usage is 17.248.

## Usage example (dummy data)

**POST** -> http://localhost:3001/

    {
	    "flow_volume": 0.064
    }

**RESPONSE**

    {
        "id": "[dinamyc_identifier]",
        "flow_volume": 0.064
    }
---
**PUT** -> http://localhost:3001/[dinamyc_identifier]

    {
	    "status": "open",
	    "updated_at": "2022-01-01T02:00:22"
    }
---
**GET** -> http://localhost:3001/[dinamyc_identifier]

    {
	    "amount": "17.248"
	    "usages": [
		    {
			    "opened_at": "2022-01-01T02:00:00Z",
			    "closed_at": "2022-01-01T02:00:22Z",
			    "total_spend": 1.408
		    }
		 ]
    }