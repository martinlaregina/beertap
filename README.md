## BeerTAP

**Welcome to beerTAP: Your bar tender**

Whether the dispenser is open or close, this endpoint returns how much money has this dispenser Id spent break down by its uses. This endpoint could be request at any time, even if the tap is open (so, the  `closed_at`  field would be  `null`).

To do so, we will use a reference value of 12.25€/l.

So, if the dispenser has configured the flow volume ratio as 0.064 litres/second and the tap was open for 22 seconds, the total spent for this usage is 17.248.