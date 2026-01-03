import { Box, Container, Grid, Paper, Typography, Card, CardContent, LinearProgress } from '@mui/material';
import { 
  TrendingUp, 
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
  color: string;
  trend?: string;
  gradient: string;
}

const StatCard = ({ title, value, icon, color, trend, gradient }: StatCardProps) => (
  <Card
    sx={{
      height: '100%',
      background: gradient,
      color: 'white',
      position: 'relative',
      overflow: 'hidden',
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 24px rgba(168, 85, 247, 0.4)',
      },
    }}
  >
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500 }}>
            {title}
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 700, mt: 1, mb: 0.5 }}>
            {value}
          </Typography>
          {trend && (
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              {trend}
            </Typography>
          )}
        </Box>
        <Box
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            p: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
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
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(135deg, #A855F7 0%, #EC4899 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 1,
          }}
        >
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome back! Here's what's happening with your recruitment.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Requirements"
            value="24"
            icon={<Description sx={{ fontSize: 32 }} />}
            color="primary.main"
            gradient="linear-gradient(135deg, #A855F7 0%, #9333EA 100%)"
            trend="+3 this week"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending Approvals"
            value="8"
            icon={<PendingActions sx={{ fontSize: 32 }} />}
            color="warning.main"
            gradient="linear-gradient(135deg, #F59E0B 0%, #D97706 100%)"
            trend="5 urgent"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Positions"
            value="16"
            icon={<WorkOutline sx={{ fontSize: 32 }} />}
            color="success.main"
            gradient="linear-gradient(135deg, #22D3EE 0%, #06B6D4 100%)"
            trend="12 open"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Filled This Month"
            value="5"
            icon={<CheckCircleOutline sx={{ fontSize: 32 }} />}
            color="success.main"
            gradient="linear-gradient(135deg, #10B981 0%, #059669 100%)"
            trend="Target: 8"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Status Overview */}
        <Grid item xs={12} md={8}>
          <Paper
            sx={{
              p: 3,
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 3,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Requirement Status Overview
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Draft
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  4 (17%)
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={17}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: 'rgba(168, 85, 247, 0.1)',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4,
                    background: 'linear-gradient(90deg, #9CA3AF 0%, #6B7280 100%)',
                  },
                }}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Pending Approval
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  8 (33%)
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={33}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: 'rgba(168, 85, 247, 0.1)',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4,
                    background: 'linear-gradient(90deg, #F59E0B 0%, #D97706 100%)',
                  },
                }}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Active
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  12 (50%)
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={50}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: 'rgba(168, 85, 247, 0.1)',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4,
                    background: 'linear-gradient(90deg, #22D3EE 0%, #06B6D4 100%)',
                  },
                }}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 3,
              height: '100%',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Recent Activity
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {recentActivities.map((activity) => (
                <Box
                  key={activity.id}
                  sx={{
                    display: 'flex',
                    gap: 2,
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      transform: 'translateX(4px)',
                    },
                  }}
                >
                  <Box sx={{ flexShrink: 0 }}>{getActivityIcon(activity.type)}</Box>
                  <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600, mb: 0.5 }}
                      noWrap
                    >
                      {activity.title}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: 'block', mb: 0.5 }}
                      noWrap
                    >
                      {activity.description}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
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
  );
};

export default Dashboard;
