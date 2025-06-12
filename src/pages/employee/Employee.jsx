import React, { useState, useEffect, useContext } from 'react';
import { useSelector } from 'react-redux';
import { ThemeContext } from '../../theme/ThemeProvider';
import axios from 'axios';
import API from '../../API';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Grid,
  IconButton,
  Avatar,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Tooltip,
  InputAdornment,
  CircularProgress,
  Fade,
  Zoom,
  Collapse,
  Card,
  CardContent,
  CardHeader,
  Divider,
  useTheme,
  alpha,
  Tabs,
  Tab,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Backdrop,
  Alert,
  Snackbar,
  Badge,
  Switch,
  FormControlLabel,
  Autocomplete,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Work as WorkIcon,
  Category as CategoryIcon,
  MoreVert as MoreVertIcon,
  Close as CloseIcon,
  Save as SaveIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Message as MessageIcon,
  Assignment as AssignmentIcon,
  SupervisorAccount as SupervisorIcon,
  Group as GroupIcon,
  Sort as SortIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
  Dashboard as DashboardIcon,
  CalendarToday as CalendarIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { format } from 'date-fns';
import Swal from 'sweetalert2';

// Styled components
const StyledPaper = styled(Paper)(({ theme, isDarkMode }) => ({
  borderRadius: 16,
  overflow: 'hidden',
  boxShadow: isDarkMode
    ? '0 8px 32px rgba(0, 0, 0, 0.4)'
    : '0 8px 32px rgba(41, 43, 64, 0.1)',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    boxShadow: isDarkMode
      ? '0 10px 40px rgba(0, 0, 0, 0.5)'
      : '0 10px 40px rgba(41, 43, 64, 0.2)',
  },
}));

const StyledTableRow = styled(TableRow)(({ theme, isDarkMode }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: isDarkMode
      ? alpha(theme.palette.primary.main, 0.05)
      : alpha(theme.palette.primary.main, 0.02),
  },
  '&:hover': {
    backgroundColor: isDarkMode
      ? alpha(theme.palette.primary.main, 0.1)
      : alpha(theme.palette.primary.main, 0.05),
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  },
  transition: 'background-color 0.2s ease',
}));

const StyledTableCell = styled(TableCell)(({ theme, isDarkMode }) => ({
  borderBottom: `1px solid ${isDarkMode
    ? alpha(theme.palette.divider, 0.3)
    : alpha(theme.palette.divider, 0.5)
    }`,
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 40,
  height: 40,
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  border: `2px solid ${theme.palette.background.paper}`,
  transition: 'transform 0.2s ease',
  '&:hover': {
    transform: 'scale(1.1)',
  },
}));

const StyledChip = styled(Chip)(({ theme, color }) => ({
  fontWeight: 'bold',
  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.08)',
  transition: 'all 0.2s ease',
  '&:hover': {
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
    transform: 'translateY(-2px)',
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: 8,
  textTransform: 'none',
  fontWeight: 'bold',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.2s ease',
  '&:hover': {
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
    transform: 'translateY(-2px)',
  },
}));

const StyledTab = styled(Tab)(({ theme, isDarkMode }) => ({
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '0.9rem',
  minWidth: 100,
  '&.Mui-selected': {
    color: theme.palette.primary.main,
  },
  '&:hover': {
    backgroundColor: isDarkMode
      ? alpha(theme.palette.primary.main, 0.1)
      : alpha(theme.palette.primary.main, 0.05),
    borderRadius: '8px 8px 0 0',
  },
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email format').required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
    )
    .required('Password is required'),
  role: Yup.string().required('Role is required'),
  category: Yup.string().required('Category is required'),
  status: Yup.string().required('Status is required'),
});

const updateValidationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email format').required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
    )
    .notRequired(),
  role: Yup.string().required('Role is required'),
  category: Yup.string().required('Category is required'),
  status: Yup.string().required('Status is required'),
});

const Employee = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const theme = useTheme();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  // State variables
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0); // Add this line
  // Update the statistics state to match the API response structure
  const [statistics, setStatistics] = useState({
    totalUsers: 0,
    byRole: {},
    byCategory: {},
    byStatus: {},
    recentUsers: []
  });


  const filteredEmployees = employees.filter(employee => {
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        employee.name.toLowerCase().includes(query) ||
        employee.email.toLowerCase().includes(query) ||
        (employee.category && employee.category.toLowerCase().includes(query));
      if (!matchesSearch) return false;
    }

    // Filter by role
    if (filterRole !== 'all' && employee.role !== filterRole) {
      return false;
    }

    // Filter by category
    if (filterCategory !== 'all' && employee.category !== filterCategory) {
      return false;
    }

    // Filter by status
    if (filterStatus !== 'all' && employee.status !== filterStatus) {
      return false;
    }

    return true;
  });


  // Sort function
  const sortedEmployees = [...filteredEmployees].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    }
    return aValue < bValue ? 1 : -1;
  });

  // Get paginated data
  const paginatedEmployees = sortedEmployees.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Fetch statistics
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const token = localStorage.getItem('token');
        const userRole = localStorage.getItem('role');

        if (userRole === 'CEO') {
          const response = await axios.get(`${API}/users/stats`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          setStatistics(response.data);
        }
      } catch (err) {
        console.error('Failed to fetch statistics:', err);
      }
    };

    fetchStatistics();
  }, [refreshKey]);

  // Fetch employees
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API}/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEmployees(response.data.users); // Fix: access the users array from response
        setLoading(false);
      }
      catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }
    fetchEmployees();
  }, [refreshKey]);

  // Render statistics cards
  const renderStatisticsCards = () => {
    return (
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Total Users Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            sx={{
              borderRadius: 3,
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
              overflow: 'hidden',
              height: '100%',
            }}
          >
            <Box sx={{
              p: 2,
              background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
              color: 'white'
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" fontWeight="bold">Total Users</Typography>
                <Avatar sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)' }}>
                  <GroupIcon />
                </Avatar>
              </Box>
            </Box>
            <CardContent sx={{ pt: 2 }}>
              <Typography variant="h3" component="div" fontWeight="bold" align="center">
                {statistics.totalUsers || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                Total registered users in the system
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Active Users Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            sx={{
              borderRadius: 3,
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
              overflow: 'hidden',
              height: '100%',
            }}
          >
            <Box sx={{
              p: 2,
              background: `linear-gradient(45deg, ${theme.palette.success.main} 30%, ${theme.palette.success.dark} 90%)`,
              color: 'white'
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" fontWeight="bold">Active Users</Typography>
                <Avatar sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)' }}>
                  <CheckCircleIcon />
                </Avatar>
              </Box>
            </Box>
            <CardContent sx={{ pt: 2 }}>
              <Typography variant="h3" component="div" fontWeight="bold" align="center">
                {statistics.byStatus?.active || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                Currently active users
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Role Distribution Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            sx={{
              borderRadius: 3,
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
              overflow: 'hidden',
              height: '100%',
            }}
          >
            <Box sx={{
              p: 2,
              background: `linear-gradient(45deg, ${theme.palette.warning.main} 30%, ${theme.palette.warning.dark} 90%)`,
              color: 'white'
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" fontWeight="bold">Role Distribution</Typography>
                <Avatar sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)' }}>
                  <WorkIcon />
                </Avatar>
              </Box>
            </Box>
            <CardContent sx={{ pt: 2 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography>CEOs:</Typography>
                  <Typography fontWeight="bold">{statistics.byRole?.CEO || 0}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography>Managers:</Typography>
                  <Typography fontWeight="bold">{statistics.byRole?.Manager || 0}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography>Employees:</Typography>
                  <Typography fontWeight="bold">{statistics.byRole?.Employee || 0}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Category Distribution Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            sx={{
              borderRadius: 3,
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
              overflow: 'hidden',
              height: '100%',
            }}
          >
            <Box sx={{
              p: 2,
              background: `linear-gradient(45deg, ${theme.palette.info.main} 30%, ${theme.palette.info.dark} 90%)`,
              color: 'white'
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" fontWeight="bold">Categories</Typography>
                <Avatar sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)' }}>
                  <CategoryIcon />
                </Avatar>
              </Box>
            </Box>
            <CardContent sx={{ pt: 2 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography>Developers:</Typography>
                  <Typography fontWeight="bold">{statistics.byCategory?.Developer || 0}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography>DevOps:</Typography>
                  <Typography fontWeight="bold">{statistics.byCategory?.DevOps || 0}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography>HR:</Typography>
                  <Typography fontWeight="bold">{statistics.byCategory?.HR || 0}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Users Card */}
        <Grid item xs={12}>
          <Card
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            sx={{
              borderRadius: 3,
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
              overflow: 'hidden',
            }}
          >
            <Box sx={{
              p: 2,
              background: `linear-gradient(45deg, ${theme.palette.secondary.main} 30%, ${theme.palette.secondary.dark} 90%)`,
              color: 'white'
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" fontWeight="bold">Recent Users</Typography>
                <Avatar sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)' }}>
                  <PersonIcon />
                </Avatar>
              </Box>
            </Box>
            <CardContent>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Joined</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {statistics.recentUsers?.map((user) => (
                      <TableRow key={user._id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Chip
                            label={user.role}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          {user.category ? (
                            <Chip
                              label={user.category}
                              size="small"
                              color="secondary"
                              variant="outlined"
                            />
                          ) : (
                            '-'
                          )}
                        </TableCell>
                        <TableCell>
                          {format(new Date(user.createdAt), 'MMM dd, yyyy')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  // Render category distribution
  const renderCategoryDistribution = () => {
    const categories = statistics.categories || {};
    const categoryNames = Object.keys(categories);

    return (
      <Card
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        sx={{
          borderRadius: 3,
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
          mb: 4,
          overflow: 'hidden',
        }}
      >
        <CardHeader
          title="Category Distribution"
          subheader="Number of employees in each category"
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiCardHeader-title': {
              fontWeight: 'bold',
            },
          }}
        />
        <CardContent>
          <Grid container spacing={2}>
            {categoryNames.map((category) => (
              <Grid item xs={12} sm={4} key={category}>
                <Box sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: alpha(getCategoryColor(category), 0.1),
                  border: `1px solid ${alpha(getCategoryColor(category), 0.3)}`,
                }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6" fontWeight="bold">{category}</Typography>
                    <Chip
                      label={categories[category]}
                      sx={{
                        bgcolor: getCategoryColor(category),
                        color: 'white',
                        fontWeight: 'bold',
                      }}
                    />
                  </Box>
                  <Box sx={{ mt: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={(categories[category] / statistics.total) * 100}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: alpha(getCategoryColor(category), 0.2),
                        '& .MuiLinearProgress-bar': {
                          bgcolor: getCategoryColor(category),
                        }
                      }}
                    />
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    );
  };

  // Render employee table
  const renderEmployeeTable = () => {
    // Sort function
    const sortedEmployees = [...filteredEmployees].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      }
      return aValue < bValue ? 1 : -1;
    });

    // Get paginated data
    const paginatedEmployees = sortedEmployees.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );

    // Handle page change
    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };

    // Handle rows per page change
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };

    // Handle sort
    const handleSort = (field) => {
      if (sortField === field) {
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
      } else {
        setSortField(field);
        setSortDirection('asc');
      }
    };


    return (
      <StyledPaper isDarkMode={isDarkMode}>
        <Box>
          {/* Search and Filter Controls */}
          <Paper sx={{ p: 2, mb: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search employees..."
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <FormControl fullWidth>
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    label="Role"
                  >
                    <MenuItem value="all">All Roles</MenuItem>
                    <MenuItem value="CEO">CEO</MenuItem>
                    <MenuItem value="Manager">Manager</MenuItem>
                    <MenuItem value="Employee">Employee</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={2}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    label="Category"
                  >
                    <MenuItem value="all">All Categories</MenuItem>
                    <MenuItem value="Developer">Developer</MenuItem>
                    <MenuItem value="DevOps">DevOps</MenuItem>
                    <MenuItem value="HR">HR</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={2}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    label="Status"
                  >
                    <MenuItem value="all">All Status</MenuItem>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>

          {/* Employee Table */}
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    S.No
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                      onClick={() => handleSort('name')}>
                      Name
                      {sortField === 'name' && (
                        sortDirection === 'asc' ? <ArrowUpIcon /> : <ArrowDownIcon />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedEmployees.map((employee) => (
                  <StyledTableRow key={employee._id}>
                    <StyledTableCell>{paginatedEmployees.indexOf(employee) + 1}</StyledTableCell>
                    <StyledTableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <StyledAvatar src={employee.avatar}>
                          {employee.name.charAt(0)}
                        </StyledAvatar>
                        <Typography sx={{ ml: 2 }}>{employee.name}</Typography>
                      </Box>
                    </StyledTableCell>
                    <StyledTableCell>{employee.email}</StyledTableCell>
                    <StyledTableCell>
                      <StyledChip label={employee.role} color="primary" variant="outlined" />
                    </StyledTableCell>
                    <StyledTableCell>
                      <StyledChip label={employee.category} color="secondary" variant="outlined" />
                    </StyledTableCell>
                    <StyledTableCell>
                      <StyledChip
                        label={employee.status}
                        color={employee.status === 'active' ? 'success' : 'error'}
                        variant="outlined"
                      />
                    </StyledTableCell>
                    <StyledTableCell>
                      {/* Action buttons */}
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(employee);
                        }}
                        className="hover:text-blue-500 transform transition-all duration-300 hover:scale-110"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        aria-label="Delete"
                        onClick={() => handleDeleteEmployee(employee)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              component="div"
              count={filteredEmployees.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25]}
            />
          </TableContainer>

          {/* Add the edit modal */}
          <EditEmployeeModal
            open={openDialog}
            onClose={() => setOpenDialog(false)}
            employee={selectedEmployee}
            onSuccess={handleEditSuccess}
          />


        </Box>
      </StyledPaper>
    );
  };


  // Add this component for the edit modal
  const EditEmployeeModal = ({ open, onClose, employee, onSuccess }) => {
    const { isDarkMode } = useContext(ThemeContext);
    const theme = useTheme();

    // Fancy glassmorphism styles
    const glassStyle = {
      background: isDarkMode
        ? 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.1) 100%)'
        : 'linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.9) 100%)',
      backdropFilter: 'blur(10px)',
      border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.3)'}`,
      boxShadow: isDarkMode
        ? '0 8px 32px rgba(0,0,0,0.4)'
        : '0 8px 32px rgba(31,38,135,0.15)'
    };

    // Neon glow effect
    const neonGlow = {
      boxShadow: `0 0 15px ${alpha(theme.palette.primary.main, 0.5)}, 
                0 0 30px ${alpha(theme.palette.primary.main, 0.3)}, 
                0 0 45px ${alpha(theme.palette.primary.main, 0.1)}`
    };

    // Gradient text style
    const gradientText = {
      background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    };

    // Floating animation
    const floatingAnimation = {
      animation: 'floating 3s ease-in-out infinite',
      '@keyframes floating': {
        '0%': { transform: 'translateY(0px)' },
        '50%': { transform: 'translateY(-10px)' },
        '100%': { transform: 'translateY(0px)' }
      }
    };

    // Ripple effect style
    const rippleStyle = {
      position: 'relative',
      overflow: 'hidden',
      '&:after': {
        content: '""',
        position: 'absolute',
        width: '100%',
        height: '100%',
        background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.2)} 0%, transparent 70%)`,
        transform: 'scale(0)',
        transition: 'transform 0.5s',
        top: 0,
        left: 0
      },
      '&:hover:after': {
        transform: 'scale(2)'
      }
    };

    const formik = useFormik({
      initialValues: {
        name: employee?.name || '',
        email: employee?.email || '',
        role: employee?.role || '',
        category: employee?.category || '',
        status: employee?.status || '',
      },
      validationSchema: updateValidationSchema,
      onSubmit: async (values) => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.put(
            `${API}/users/${employee._id}`,
            values,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: response.data.message,
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            background: isDarkMode ? '#1f2937' : '#ffffff',
            color: isDarkMode ? '#f3f4f6' : '#111827'
          });

          onSuccess();
          onClose();
        } catch (err) {
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: err.response?.data?.message || 'Failed to update employee',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            background: isDarkMode ? '#1f2937' : '#ffffff',
            color: isDarkMode ? '#f3f4f6' : '#111827'
          });
        }
      },
    });

    return (
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Fade}
        TransitionProps={{ timeout: 500 }}
        PaperProps={{
          sx: {
            ...glassStyle,
            borderRadius: '24px',
            overflow: 'hidden'
          }
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 20
          }}
          style={floatingAnimation}
        >
          <DialogTitle
            sx={{
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.secondary.main, 0.1)})`,
              borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              py: 3
            }}
          >
            <Typography
              variant="h5"
              component="div"
              fontWeight="bold"
              sx={gradientText}
            >
              ✨ Edit Employee Profile
            </Typography>
            <IconButton
              onClick={onClose}
              sx={{
                ...rippleStyle,
                '&:hover': {
                  transform: 'rotate(90deg)',
                  transition: 'transform 0.3s ease'
                }
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <DialogContent sx={{ mt: 3, px: 4 }}>
            <form onSubmit={formik.handleSubmit}>
              <Grid container spacing={3}>
                {/* Form fields remain the same but with enhanced styling */}
                {/* ... */}
              </Grid>
            </form>
          </DialogContent>

          <DialogActions
            sx={{
              p: 3,
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)}, ${alpha(theme.palette.secondary.main, 0.05)})`,
              borderTop: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              gap: 2
            }}
          >
            <Button
              onClick={onClose}
              variant="outlined"
              startIcon={<CloseIcon />}
              sx={{
                borderRadius: '12px',
                textTransform: 'none',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: `0 5px 15px ${alpha(theme.palette.error.main, 0.2)}`
                }
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={formik.handleSubmit}
              variant="contained"
              startIcon={<SaveIcon />}
              sx={{
                borderRadius: '12px',
                textTransform: 'none',
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                ...neonGlow,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: `0 5px 15px ${alpha(theme.palette.primary.main, 0.4)}`
                }
              }}
            >
              Save Changes
            </Button>
          </DialogActions>
        </motion.div>
      </Dialog>
    );
  };



  // Add this function to handle edit
  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setOpenDialog(true);
  };

  // Add this function to handle edit success
  const handleEditSuccess = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div>
      {renderStatisticsCards()}
      {/* {renderCategoryDistribution()} */}
      {renderEmployeeTable()}
    </div>
  );
};

export default Employee;
