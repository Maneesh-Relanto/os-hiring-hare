import { Box, Container, Grid, Paper, Typography, Card, CardContent, LinearProgress } from '@mui/material';
import { 
  PendingActions, 
  WorkOutline, 
  CheckCircleOutline,
  PersonAdd,
  Description 
} from '@mui/icons-material';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  gradient: string;
}

const StatCard = ({ title, value, icon, trend, gradient }: StatCardProps) => (
  <Card
    elevation={0}
    sx={{
      height: '100%',
      background: gradient,
      color: 'white',
      position: 'relative',
      overflow: 'hidden',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      '&:hover': {
        transform: 'translateY(-8px) scale(1.02)',
        boxShadow: '0 20px 40px rgba(99, 102, 241, 0.3)',
      },
    }}
  >
    <CardContent sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="body2" sx={{ opacity: 0.95, fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase', fontSize: '0.75rem' }}>
            {title}
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 800, mt: 1.5, mb: 0.5, fontSize: '2.5rem' }}>
            {value}
          </Typography>
          {trend && (
            <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500, mt: 1 }}>
              {trend}
            </Typography>
          )}
        </Box>
        <Box
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.25)',
            borderRadius: '16px',
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(10px)',
          }}
        >
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

interface ActivityItem {
  id: number;
  type: 'requirement' | 'approval' | 'candidate' | 'interview';
  title: string;
  description: string;
  time: string;
  user: string;
}

const recentActivities: ActivityItem[] = [
  {
    id: 1,
    type: 'requirement',
    title: 'New Requirement Created',
    description: 'Senior Software Engineer - Backend Team',
    time: '2 hours ago',
    user: 'John Doe',
  },
  {
    id: 2,
    type: 'approval',
    title: 'Requirement Approved',
    description: 'Frontend Developer - React Team',
    time: '4 hours ago',
    user: 'Jane Smith',
  },
  {
    id: 3,
    type: 'candidate',
    title: 'New Candidate Applied',
    description: 'DevOps Engineer Position',
    time: '6 hours ago',
    user: 'Mike Johnson',
  },
  {
    id: 4,
    type: 'interview',
    title: 'Interview Scheduled',
    description: 'Data Scientist - AI Team',
    time: '1 day ago',
    user: 'Sarah Williams',
  },
];

const getActivityIcon = (type: ActivityItem['type']) => {
  switch (type) {
    case 'requirement':
      return <Description sx={{ color: 'primary.main' }} />;
    case 'approval':
      return <CheckCircleOutline sx={{ color: 'success.main' }} />;
    case 'candidate':
      return <PersonAdd sx={{ color: 'secondary.main' }} />;
    case 'interview':
      return <WorkOutline sx={{ color: 'info.main' }} />;
  }
};

const Dashboard = () => {
  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 5 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              background: 'linear-gradient(135deg, #6366F1 0%, #EC4899 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1,
            }}
          >
            Dashboard
          </Typography>
          <Typography variant="h6" color="text.secondary" fontWeight={500}>
            Welcome back! Here's what's happening with your recruitment.
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} lg={3}>
            <StatCard
              title="Total Requirements"
              value="24"
              icon={<Description sx={{ fontSize: 36 }} />}
              gradient="linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)"
              trend="+3 this week"
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <StatCard
              title="Pending Approvals"
              value="8"
              icon={<PendingActions sx={{ fontSize: 36 }} />}
              gradient="linear-gradient(135deg, #F59E0B 0%, #D97706 100%)"
              trend="5 urgent"
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <StatCard
              title="Active Positions"
              value="16"
              icon={<WorkOutline sx={{ fontSize: 36 }} />}
              gradient="linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)"
              trend="12 open"
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <StatCard
              title="Filled This Month"
              value="5"
              icon={<CheckCircleOutline sx={{ fontSize: 36 }} />}
              gradient="linear-gradient(135deg, #10B981 0%, #059669 100%)"
              trend="Target: 8"
            />
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {/* Status Overview */}
          <Grid item xs={12} lg={8}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 4 }}>
                Requirement Status Overview
              </Typography>

              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                  <Typography variant="body1" color="text.primary" fontWeight={600}>
                    Draft
                  </Typography>
                  <Typography variant="body1" color="text.secondary" fontWeight={600}>
                    4 (17%)
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={17}
                  sx={{
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: 'rgba(100, 116, 139, 0.1)',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 6,
                      background: 'linear-gradient(90deg, #94A3B8 0%, #64748B 100%)',
                    },
                  }}
                />
              </Box>

              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                  <Typography variant="body1" color="text.primary" fontWeight={600}>
                    Pending Approval
                  </Typography>
                  <Typography variant="body1" color="text.secondary" fontWeight={600}>
                    8 (33%)
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={33}
                  sx={{
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 6,
                      background: 'linear-gradient(90deg, #F59E0B 0%, #D97706 100%)',
                    },
                  }}
                />
              </Box>

              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                  <Typography variant="body1" color="text.primary" fontWeight={600}>
                    Active
                  </Typography>
                  <Typography variant="body1" color="text.secondary" fontWeight={600}>
                    12 (50%)
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={50}
                  sx={{
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 6,
                      background: 'linear-gradient(90deg, #3B82F6 0%, #2563EB 100%)',
                    },
                  }}
                />
              </Box>
            </Paper>
          </Grid>

          {/* Recent Activity */}
          <Grid item xs={12} lg={4}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                height: '100%',
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 4 }}>
                Recent Activity
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                {recentActivities.map((activity) => (
                  <Box
                    key={activity.id}
                    sx={{
                      display: 'flex',
                      gap: 2,
                      p: 2,
                      borderRadius: 2,
                      backgroundColor: 'rgba(99, 102, 241, 0.04)',
                      border: '1px solid',
                      borderColor: 'divider',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: 'rgba(99, 102, 241, 0.08)',
                        transform: 'translateX(6px)',
                        borderColor: 'primary.main',
                      },
                    }}
                  >
                    <Box sx={{ flexShrink: 0, pt: 0.5 }}>{getActivityIcon(activity.type)}</Box>
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 700, mb: 0.5 }}
                        noWrap
                      >
                        {activity.title}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: 'block', mb: 0.5, lineHeight: 1.5 }}
                        noWrap
                      >
                        {activity.description}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" fontWeight={500}>
                        {activity.time} • {activity.user}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;
