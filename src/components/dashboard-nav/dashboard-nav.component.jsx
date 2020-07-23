import React, { useState, useContext } from "react";
import clsx from "clsx";
import { Link, useLocation } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import MenuIcon from "@material-ui/icons/Menu";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import BarChartIcon from "@material-ui/icons/BarChart";
import Avatar from "@material-ui/core/Avatar";
import { UserContext } from "../../providers/user.provider";
import { BudgetContext } from "../../providers/budget.provider";
import { FeedbackContext } from "../../providers/feedback.provider";
import { logout } from "../../api";

const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: "none",
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9),
    },
  },
  link: {
    textDecoration: "none",
    color: "inherit",
    display: "flex",
    alignItems: "center",
    transition: "all 0.2s",
    "&:hover": {
      transform: "translateY(-2px)",
      textShadow: "0 0.1rem 0.2rem black",
    },
  },
  avatar: {
    marginRight: theme.spacing(1),
  },
  divider: {
    margin: theme.spacing(0, 1),
    backgroundColor: "currentColor",
  },
}));

const DashboardNav = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(true);
  const { user, currentUser } = useContext(UserContext);
  const { addBudget, resetDate } = useContext(BudgetContext);
  const { triggerAlert } = useContext(FeedbackContext);
  const location = useLocation();
  const ToolbarName = location.pathname.split("/")[1];
  const ToolbarNameCapitalized =
    ToolbarName.charAt(0).toUpperCase() + ToolbarName.slice(1);

  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    currentUser(undefined);
    addBudget(undefined);
    resetDate();
    triggerAlert("success", "successfully logged out");
  };
  return (
    <>
      <AppBar
        position="absolute"
        className={clsx(classes.appBar, open && classes.appBarShift)}
      >
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(
              classes.menuButton,
              open && classes.menuButtonHidden
            )}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            className={classes.title}
          >
            {ToolbarNameCapitalized}
          </Typography>
          <Typography component="h1" variant="h6" color="inherit" noWrap>
            <Link
              to="/"
              className={classes.link}
              onClick={() => handleLogout()}
            >
              Logout
            </Link>
          </Typography>
          <Divider
            orientation="vertical"
            flexItem
            className={classes.divider}
          />
          <Typography component="h1" variant="h6" color="inherit" noWrap>
            <Link to="/profile" className={classes.link}>
              <Avatar
                src={user.photo}
                alt="profile picture"
                className={classes.avatar}
              />
              <span>{user.name}</span>
            </Link>
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>
          <ListItem
            button
            selected={location.pathname === "/budgets"}
            component={Link}
            to="/budgets"
          >
            <ListItemIcon>
              <AccountBalanceIcon />
            </ListItemIcon>
            <ListItemText primary="Budgets" />
          </ListItem>
          <ListItem
            button
            selected={location.pathname === "/reports"}
            component={Link}
            to="/reports"
          >
            <ListItemIcon>
              <BarChartIcon />
            </ListItemIcon>
            <ListItemText primary="Reports" />
          </ListItem>
        </List>
      </Drawer>
    </>
  );
};

export default DashboardNav;
