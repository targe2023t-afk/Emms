namespace EMMS.Domain.Common.Enums;

public enum Priority
{
    Low = 1,
    Medium = 2,
    High = 3,
    Critical = 4
}

public enum WorkOrderStatus
{
    Draft = 1,
    Open = 2,
    InProgress = 3,
    OnHold = 4,
    Completed = 5,
    Cancelled = 6
}

public enum MaintenanceType
{
    Preventive = 1,
    Corrective = 2,
    Predictive = 3,
    Emergency = 4
}
