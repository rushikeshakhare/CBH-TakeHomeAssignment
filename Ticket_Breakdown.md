# Ticket Breakdown
We are a staffing company whose primary purpose is to book Agents at Shifts posted by Facilities on our platform. We're working on a new feature which will generate reports for our client Facilities containing info on how many hours each Agent worked in a given quarter by summing up every Shift they worked. Currently, this is how the process works:

- Data is saved in the database in the Facilities, Agents, and Shifts tables
- A function `getShiftsByFacility` is called with the Facility's id, returning all Shifts worked that quarter, including some metadata about the Agent assigned to each
- A function `generateReport` is then called with the list of Shifts. It converts them into a PDF which can be submitted by the Facility for compliance.

## You've been asked to work on a ticket. It reads:

**Currently, the id of each Agent on the reports we generate is their internal database id. We'd like to add the ability for Facilities to save their own custom ids for each Agent they work with and use that id when generating reports for them.**


Based on the information given, break this ticket down into 2-5 individual tickets to perform. Provide as much detail for each ticket as you can, including acceptance criteria, time/effort estimates, and implementation details. Feel free to make informed guesses about any unknown details - you can't guess "wrong".


You will be graded on the level of detail in each ticket, the clarity of the execution plan within and between tickets, and the intelligibility of your language. You don't need to be a native English speaker, but please proof-read your work.

## Your Breakdown Here

Ticket 1 [API_CREATE_FACILITIES_AGENT_MAPPING]: Create a backend feature to map the original Agent Ids to Facilities-Agent Ids. 

Description: Task is to create a new table that will hold Facilities-Agent mapping.
It will have three fields other than the default fields `facility_id, agent_id, facility_agent_id`, where `agent_id` will refer to the id of Agent in  `Agents` table (Create a `Index or Key` here.) 
This table will be used by a new api that has to be created for creating this mapping from frontend. API Will function as follows,

- Takes an input from client as array of objects `agent_id, facility_agent_id (custom id)` and the `facility_id` from auth token or logged in information of facility.
- Create a new mapping for each unique `agent_id` and `facility_id` record in a database or warn client if there is a duplication.
- Validation should be there create only one unique Id per Facility Per Agent.


Ticket 2 [MIGRATE_FACILTIES_AGENT_IDS]: Create a side effect service after that will update the `agent_id`s with new `facility_agent_id`s

Description: Create a side effect service that will take input of as `facility_id` and array of objects containing affected rows from [API_CREATE_FACILITIES_AGENT_MAPPING] task `agent_id, facility_agent_id`.

- Once this service is called the module service of `getShiftsByFacility` and `generateReport` should be set to under maintenance. 
- Update all the existing tables with the reference to `agent_ids` to new `facility_agent_id` for the agents for that particular facility shift.
- Once the operation is completed update the maintenance service to up.


Ticket 3 [FEATURE_TO_UPDATE_AGENT_IDS]: Create a frontend feature to map the original Agent Ids to Facilities-Agent Ids.

Description: Task is to create a feature where Facilities can assign custom ids to the agents they are working with. For each facility there will be a interface as follows. It will list the all the agents with a following format

`Agent Name - Input Box (To input custom id for the agent)`

Agent Name will show the agent name and facility can input the custom Id into the Input Box in front of each agent. eg. there are 10 agents , interface should show 10 rows (scrollable in a section) where agent name and input box is shown in front of each agent. There should be a save button at the bottom which should validate that all the data is filled up. Validate that all the `facility_agent_id` fields are filled and should have at least length of 8-10 characters. Once the valid information is entered the save button should be enabled and facility should be able to update the new `agent_ids`.

The input gathered here is array of objects `agent_id, facility_agent_id` and this should be sent to the api [API_CREATE_FACILITIES_AGENT_MAPPING] and the alert the frontend interface once the records are created.