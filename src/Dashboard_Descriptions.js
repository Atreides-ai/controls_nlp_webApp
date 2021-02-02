const dashboardDescriptions = {
    fully_card:
        'These controls meet the core design metrics. This means they have a defined What, How, When and Who component.',
    mostly_card:
        'These controls meet 3/4 of the core design metrics. This means they have any 3 of What, How, When and Who defined.',
    partially_card:
        'These controls meet 2/4 of the core design metrics. This means they have any 2 of What, How, When and Who defined.',
    poorly_card:
        'These controls meet 1/4 of the core design metrics. This means they have any 1 of What, How, When and Who defined.',
    none_card:
        'These controls meet 0/4 of the core design metrics. This means there is no What, How, When or Who defined.',
    strong_risk_card:
        'These controls have a strong relevance rating to the risk to which they are linked. This means they are likely to mitigate the risk.',
    good_risk_card:
        'These controls have a good relevance rating to the risk to which they are linked. This means that while they are clearly related, there may be elements of the risk that are not covered or elements of risk the control covers that the risk has not identified.',
    fair_risk_card:
        'These controls have a fair relevance rating to the risk to which they are linked. This means that there is some relation between the risk and control but it could be clearer, these controls may need revision.',
    poor_risk_card:
        'These controls have a poor relevance rating to the risk to which they are linked. These risks and controls will require review. Look out for poorly worded risks that do not have a clear cause, event and impact, or controls that may be have been linked by mistake',
    contains_whats_pie:
        'A what is defined as a clear statement indicating the core action(s) being performed. It is rare that a control does not include this element. However, if your controls do not, be careful that the control description is not a lengthy process description which does not include a clear description of action(s). ',
    contains_hows_pie:
        'A how is defined as subordinate statement to the what, defining how the action is being done or how it is evidenced as being done. If your controls do not contain a how it is likely that the what stops short of any description of the steps taken, or reference to the policy that describes the steps required.',
    contains_whos_pie:
        'A who is defined as people (named or by role) that are performing actions in the control. It is important that the control has a clear operator, watch out for generic identifiers such as Management, where accountability is difficult to establish.',
    contains_whens_pie:
        'A when is defined as an indication of the time when things in the control happen. This is commonly known as the frequency. Watch out for conflicting frequencies or ambiguity.',
    contains_thresholds_pie:
        'A threshold is numerical trigger that indicates a review or action is required. These indicate that the control is a Management Review Control or MRC.',
    contains_multiple_whats_pie:
        'There is a risk that the controls you write are too long and turn into process descriptions. Having multiple whats in a control is an indication that this has happened and that the control might need to be broken up into multiple smaller controls.',
    contains_multiple_hows_pie:
        'There is a risk that the controls you write are too long and turn into process descriptions. Similar to Whats, having multiple hows in a control is an indication that this has happened and that the control might need to be broken up into multiple smaller controls.',
    contains_multiple_whens_pie:
        'There is a risk that the controls you write have many named frequencies. Be careful. Ask yourself, is it clear when this control occurs? What triggers it?',
    contains_multiple_whos_pie:
        'There is a risk that if many people are named or identified in a control procedure that accountability is blurred. Ask yourself, do we know who is actually doing the control from the description?',
};

export default dashboardDescriptions;
